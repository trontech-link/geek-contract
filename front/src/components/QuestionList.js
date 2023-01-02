import { useEffect, useState, useCallback } from "react";
import { Divider, Skeleton, List } from "antd";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { setQuestionCount } from "../store/rootReducer";

const QuestionList = () => {
  const dispatch = useDispatch();
  let tronObj = useSelector(state => state.rooter.tronObj);
  let questionCount = useSelector(state => state.rooter.questionCount);
  const verifierAddr = process.env.REACT_APP_verifier;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [verifyObj, setVerifyObj] = useState(null);

  useEffect(() => {
    async function initVerifier() {
      if (tronObj && tronObj.tronWeb) {
        console.log("initVerifier")
        const tronWeb = tronObj.tronWeb;
        let verifier = await tronWeb.contract().at(verifierAddr);
        console.log("initVerifier verifier: ", verifier);
        const questionCountHex = await verifier.getQuestionCount().call({ _isConstant: true });
        const cnt = parseInt(tronWeb.toDecimal(questionCountHex));
        dispatch(setQuestionCount(cnt));
        setVerifyObj(verifier);
      }
    }
    initVerifier();
  }, [dispatch, tronObj, verifierAddr])

  const loadMore = async () => {
    if (tronObj && tronObj.tronWeb && verifyObj) {
      if (loading) return;
      setLoading(true);
      let tmpList = [];
      try {
        for (let i = items.length; i < questionCount && items.length < questionCount; i++) {
          const questionHex = await verifyObj.registeredQuestionList(i).call({ _isConstant: true });
          console.log("questionHex-----" + questionHex);
          let questionObj = await tronObj.tronWeb.contract().at(questionHex);
          const desc = await questionObj.description().call({ _isConstant: true });
          console.log("desc-----" + desc);
          tmpList.push({ index: i, title: `Question ${i}`, desc: desc });
        }
        setItems(items => [...items, ...tmpList]);
        setLoading(false);
      } catch (err) {
        console.log("loadMore", err);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadMore();
  }, [loading, questionCount, tronObj, verifyObj])

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={items.length < questionCount}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          header="Question List"
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Link to={`questions/${item.index}`}>{item.title}</Link>
              <div>{item.desc}</div>
            </List.Item>

          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default QuestionList;
