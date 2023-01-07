import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, message, Input, InputNumber, Button, Form } from "antd";
import { TrophyFilled, CodeFilled } from "@ant-design/icons";
import { setQuestionCount } from "../store/rootReducer";
import "../assets/styles/questionList.css";
import { triggerConstant } from "../utils/commonUtils";

const QuestionList = () => {
  const dispatch = useDispatch();
  let tronObj = useSelector((state) => state.rooter.tronObj);
  let questionCount = useSelector((state) => state.rooter.questionCount);
  const verifierAddr = process.env.REACT_APP_verifier;
  const [items, setItems] = useState([]);
  const [verifierObj, setVerifierObj] = useState(null);
  const [questionAddress, setQuestionAddress] = useState("");
  const [callValue, setCallValue] = useState(100);

  useEffect(() => {
    async function initVerifier() {
      if (tronObj && tronObj.tronWeb) {
        try {
          const tronWeb = tronObj.tronWeb;
          let verifier = await tronWeb.contract().at(verifierAddr);
          const questionCountHex = await triggerConstant(verifier, "getQuestionCount");
          const cnt = parseInt(tronWeb.toDecimal(questionCountHex));
          dispatch(setQuestionCount(cnt));
          setVerifierObj(verifier);
        } catch (err) {
          console.error("iniVerifier", err);
        }
      }
    }
    initVerifier();
  }, [dispatch, tronObj, verifierAddr]);

  useEffect(() => {
    const fetchQuestionList = async () => {
      if (tronObj && tronObj.tronWeb && verifierObj) {
        let tmpList = [];
        try {
          for (let i = items.length; i < questionCount && items.length < questionCount; i++) {
            const winner = await triggerConstant(verifierObj, "winner", i);
            const questionHex = await triggerConstant(verifierObj, "registeredQuestionList", i);
            let questionObj = await tronObj.tronWeb.contract().at(questionHex);
            const title = await triggerConstant(questionObj, "title");
            console.log("title: " + title);
            const desc = await triggerConstant(questionObj, "description");
            console.log("desc: " + desc);
            tmpList.push({ index: i, title: `${i}. ${title}`, desc: desc, winner: winner });
          }
          setItems((items) => [...items, ...tmpList]);
        } catch (err) {
          console.error("fetchQuestionList", err);
        }
      }
    };
    fetchQuestionList();
  }, [items.length, questionCount, tronObj, verifierObj]);

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

      verifierObj
        .registerQuestion(questionAddress)
        .send({ feeLimit: 100_000_000, callValue: callValue, shouldPollResponse: true })
        .then((res) => {
          console.log("res=", res);
          if (res.status === 200) {
            window.location.reload();
          } else {
            message.error(res.data);
          }
        });
    } else {
      message.info("Please connect TronLink wallet!");
    }
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "winner",
      key: "winner",
      // width: 10,
      render: (winner) => {
        if (winner && winner !== "410000000000000000000000000000000000000000") {
          return <TrophyFilled style={{ color: "#FFD700" }} />;
        } else {
          return <CodeFilled style={{ color: "#00A300" }} />;
        }
      },
    },
    {
      title: "Title",
      key: "title",
      render: (item) => (
        <a className="question-title-a" href={`questions/${item.index}`}>
          {item.title}
        </a>
      ),
    },
  ];

  return (
    <>
      <div className="left">
        <Table rowKey="index" columns={columns} dataSource={items}></Table>
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
