import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Typography, Form, Button, Input, InputNumber, message, Row, Col } from "antd";
import "../assets/styles/question.css";
import { setQuestionCount } from "../store/rootReducer";
import { checkQuestionId } from "../utils/commonUtils";
const { Text, Title, Paragraph } = Typography;

const Question = () => {
  const dispatch = useDispatch();
  const { questionId } = useParams();
  const tronObj = useSelector((state) => state.rooter.tronObj);
  const verifierAddr = process.env.REACT_APP_verifier;
  const [questionInfo, setQuestionInfo] = useState({});

  const [answerAddress, setAnswerAddress] = useState("");

  const [verifierObj, setVerifierObj] = useState(null);
  const [callValue, setCallValue] = useState(100);

  useEffect(() => {
    async function initVerifier() {
      if (tronObj && tronObj.tronWeb) {
        console.log("initVerifier");
        const tronWeb = tronObj.tronWeb;
        let verifier = await tronWeb.contract().at(verifierAddr);
        console.log("initVerifier verifier: ", verifier);
        setVerifierObj(verifier);
      }
    }
    initVerifier();
  }, [dispatch, tronObj, verifierAddr]);

  useEffect(() => {
    async function fetchQuestionInfo() {
      if (tronObj && tronObj.tronWeb && verifierObj) {
        const tronWeb = tronObj.tronWeb;
        const questionCountHex = await verifierObj.getQuestionCount().call({ _isConstant: true });
        const cnt = parseInt(tronWeb.toDecimal(questionCountHex));
        if (cnt > 0) {
          if (checkQuestionId(questionId, cnt)) {
            const questionHex = await verifierObj.registeredQuestionList(questionId).call({ _isConstant: true });
            console.log("questionHex-----" + questionHex);
            let questionObj = await tronWeb.contract().at(questionHex);

            const desc = await questionObj.description().call({ _isConstant: true });
            console.log("desc-----" + desc);

            // fetch question test cases
            let firstTestCase = [];
            const testCaseCount = await questionObj.testCaseCount().call({ _isConstant: true });
            const tcCnt = parseInt(tronWeb.toDecimal(testCaseCount));
            if (tcCnt < 1) {
              console.warn(`empty test cases of question ${questionId}`);
            } else {
              const tc = await questionObj.getTestCasesById(0).call();
              console.log("tc--------", tc);
              tc.forEach((t) => {
                if (Array.isArray(t)) {
                  firstTestCase.push(t.map((v) => tronWeb.toDecimal(v)));
                } else {
                  firstTestCase.push(t);
                }
              });
              console.log("firstTestCase-----", firstTestCase);
            }
            let i;
            setQuestionInfo({
              questionId: questionId,
              questionAddress: {
                hex: questionHex,
                base58: tronWeb.address.fromHex(questionHex),
              },
              description: desc,
              firstTestCase: firstTestCase,
            });
          }
          dispatch(setQuestionCount(cnt));
        }
      }
    }

    fetchQuestionInfo();
  }, [dispatch, questionId, tronObj, verifierAddr, verifierObj]);

  const handleVerify = async () => {
    if (tronObj && tronObj.tronWeb && verifierObj) {
      if (!answerAddress) {
        message.info("please input answer address!");
        return;
      }
      if (!callValue) {
        message.info("please deposit at least one sun for answer verify");
        return;
      }

      verifierObj
        .verify(parseInt(questionId), answerAddress)
        .send({ feeLimit: 100_000_000, callValue: callValue, shouldPollResponse: true }).then(res => {
          if (res) {
            message.info("Congratulations, your answer passed all test cases!");
          }
        })
    } else {
      message.info("Please connect TronLink wallet!");
    }
  };

  const handleWithdraw = async () => {
    if (tronObj && tronObj.tronWeb && verifierObj) {
      verifierObj.withdrawByWinner(questionId).send().then(res => {
        if (res) {
          console.log("txId=", res);
        }
      })
    } else {
      message.info("Please connect TronLink wallet!");
    }
  };

  const questionTestCase = () => {
    console.log("questionTestCase", questionInfo);
    if (questionInfo && questionInfo.firstTestCase) {
      return (
        <p>
          input [{questionInfo.firstTestCase[0].join(", ")}]
          <br />
          output [{questionInfo.firstTestCase[1].join(", ")}]
        </p>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <div className="question-box">
        <div className="question-title">
          <h2 className="question-title-text">
            Question {questionInfo && questionInfo.questionId && questionInfo.questionId}
          </h2>
        </div>
        <div className="question-description">
          <p className="question-description-text">
            {questionInfo && questionInfo.description && questionInfo.description}
          </p>
        </div>
        <div className="question-testcases">
          <h3>Test Cases</h3>
          {questionTestCase()}
        </div>
      </div>
      <div className="verify-box">
        <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item>
            <Input
              className="answer-address"
              placeholder="Answer Address"
              onChange={(e) => setAnswerAddress(e.target.value)}
              defaultValue={answerAddress}
              maxLength={64}
            />
          </Form.Item>
          <Form.Item>
            <InputNumber
              className="input"
              placeholder="callValue"
              onChange={(value) => setCallValue(parseInt(value, 10))}
              defaultValue={callValue}
              maxLength={64}
              addonAfter="sun (1 TRX = 1,000,000 SUN)"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
            <Button type="primary" className="btn" onClick={handleVerify}>
              Verify
            </Button>
            <Button type="default" className="btn" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Question;
