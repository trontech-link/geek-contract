import { useEffect } from "react";
import { List, Typography } from "antd";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from "react-redux";
import { setQuestionCount } from "../app/rooterReducer";

const QuestionList = () => {
  const dispatch = useDispatch();
  let tronObj = useSelector(state => state.rooter.tronObj);
  console.log(`++${tronObj}`);
  let questionCount = useSelector(state => state.rooter.questionCount);
  const verifierAddr = process.env.REACT_APP_verifier;

  useEffect(() => {
    console.log(
      `QuestionList fetching tronObj.tronWeb=${tronObj.tronWeb}, window.tronWeb=${window.tronWeb}`
    );
    async function fetchQuestionList() {
      const tronWeb = tronObj.tronWeb;
      if (tronWeb) {
        let verifier = await tronWeb.contract().at(verifierAddr);
        const questionCountHex = await verifier
          .getQuestionCount()
          .call({ _isConstant: true });
        const cnt = parseInt(tronWeb.toDecimal(questionCountHex));
        console.log("[QeustionList] cnt-----" + cnt);
        dispatch(setQuestionCount(cnt));

      }
    }
    fetchQuestionList();
  });

  const listItems = Array(questionCount)
    .fill(null)
    .map((_, i) => i)
    .map((i) => "Question {i}");

  return (
    // <InfiniteScroll>
      <List
        header="Question List"
        bordered
        dataSource={listItems}
        renderItem={item => (
          <List.Item>
            <Typography.Text mark>{item}</Typography.Text>
          </List.Item>
              
        )}
      />
    // </InfiniteScroll>
  );
};

export default QuestionList;
