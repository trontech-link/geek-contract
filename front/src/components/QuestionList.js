import { useEffect, useState, useCallback } from "react";
import { Space, Table, Tag, Divider, Skeleton, List, message, Input, InputNumber, Button, Form } from "antd";
import { TrophyFilled } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionCount } from "../store/rootReducer";
import "../assets/styles/questionList.css";

const QuestionList = () => {
  const dispatch = useDispatch();
  let tronObj = useSelector((state) => state.rooter.tronObj);
  let questionCount = useSelector((state) => state.rooter.questionCount);
  const verifierAddr = process.env.REACT_APP_verifier;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [verifierObj, setVerifierObj] = useState(null);
  const [questionAddress, setQuestionAddress] = useState("");
  const [callValue, setCallValue] = useState(100);

  useEffect(() => {
    async function initVerifier() {
      if (tronObj && tronObj.tronWeb) {
        console.log("initVerifier");
        const tronWeb = tronObj.tronWeb;
        let verifier = await tronWeb.contract().at(verifierAddr);
        console.log("initVerifier verifier: ", verifier);
        const questionCountHex = await verifier.getQuestionCount().call({ _isConstant: true });
        const cnt = parseInt(tronWeb.toDecimal(questionCountHex));
        dispatch(setQuestionCount(cnt));
        setVerifierObj(verifier);
      }
    }
    initVerifier();
  }, [dispatch, tronObj, verifierAddr]);

  const loadMore = useCallback(async () => {
    if (tronObj && tronObj.tronWeb && verifierObj) {
      console.log("loadMore started");
      if (loading) return;
      setLoading(true);
      let tmpList = [];
      try {
        for (let i = items.length; i < questionCount && items.length < questionCount; i++) {
          const winner = await verifierObj.winner(i).call({ _isConstant: true });
          const questionHex = await verifierObj.registeredQuestionList(i).call({ _isConstant: true });
          console.log("questionHex-----" + questionHex);
          let questionObj = await tronObj.tronWeb.contract().at(questionHex);
          const desc = await questionObj.description().call({ _isConstant: true });
          console.log("desc-----" + desc);
          tmpList.push({ index: i, title: `Question ${i}`, desc: desc, winner: winner });
        }
        setItems((items) => [...items, ...tmpList]);
        setLoading(false);
      } catch (err) {
        console.log("loadMore", err);
        setLoading(false);
      }
    }
  }, [items.length, loading, questionCount, tronObj, verifierObj]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  const handleRegisterQuestion = async () => {
    if (tronObj && tronObj.tronWeb && verifierObj) {
      if (!questionAddress) {
        message.info("please input question address!");
        return;
      }

      if (!callValue) {
        message.info("please deposit at least one sun for question");
        return;
      }

      const res = await verifierObj
        .registerQuestion(questionAddress)
        .send({ feeLimit: 100_000_000, callValue: callValue, shouldPollResponse: true });
      console.log("res-----", res);
    } else {
      message.info("Please connect TronLink wallet!");
    }
  };

  // const renderItem = (item) => {
  //   console.log("item", item);
  //   return (
  //     <List.Item>
  //       <div style={{ width: "1%" }}>{item.winner && item.winner !== "410000000000000000000000000000000000000000" ? <TrophyFilled style={{ color: "#FFD700" }} /> : <TrophyFilled style={{ opacity: 0 }} />}</div>
  //       <Link to={`questions/${item.index}`}>{item.title}</Link>
  //       <div></div>
  //       <div></div>
  //       <div>{item.desc}</div>
  //     </List.Item>
  //   );
  // };

  const columns = [
    {
      title: "Status",
      dataIndex: "winner",
      key: "winner",
      // width: 10,
      render: (winner) => {
        console.log("winner", winner);
        if (winner && winner !== "410000000000000000000000000000000000000000") {
          return <TrophyFilled style={{color: "#FFD700"}} />
        } else {
          return <TrophyFilled style={{ opacity: 0 }} />
        }
      }
    },
    {
      title: "Title",
      key: "title",
      render: (item) => <a className="question-title-a" href={`questions/${item.index}`}>{item.title}</a>
    }
  ];

  return (
    <>
      <div className="left">
        <Table rowKey="index" columns={columns} dataSource={items}></Table>
        {/* <div id="scrollableDiv" className="question-list-box">
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
              renderItem={renderItem}
            />
          </InfiniteScroll>
        </div> */}
      </div>
      <div className="group-line"></div>
      <div className="right">
        <div className="register-question-box">
          <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            <Form.Item label="Question Address">
              <Input
                className="input"
                placeholder="Question Address"
                onChange={(e) => setQuestionAddress(e.target.value)}
                defaultValue={questionAddress}
                maxLength={64}
              />
            </Form.Item>
            <Form.Item label="Call Value">
              <InputNumber
                className="input"
                placeholder="callValue"
                onChange={(value) => setCallValue(parseInt(value, 10))}
                defaultValue={callValue}
                maxLength={64}
                addonAfter="sun (1 TRX = 1,000,000 SUN)"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 12 }}>
              <Button type="primary" className="btn" onClick={handleRegisterQuestion}>
                Register Question
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default QuestionList;
