import { Button, Input, message } from "antd";
import "../assets/styles/question.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkQuestionId } from "../utils/commonUtils";

const Question = () => {
  const { questionId } = useParams();
  const verifierAddr = process.env.REACT_APP_verifier;
  const [questionInfo, setQuestionInfo] = useState({});
  const [answerAddress, setAnswerAddress] = useState("");
  const [questionAddress, setQuestionAddress] = useState("");

  useEffect(() => {
    console.log(
      `effect to fetch question info, window.tronWeb=${window.tronWeb}`
    );
    async function fetchQuestionInfo(id, tronWeb, verifierAddr) {
      console.log("tronWeb=" + tronWeb);
      if (tronWeb) {
        // const verifierAbi = [{"entrys":[{"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"name":"questionId","type":"uint256"},{"name":"winner","type":"address"},{"name":"rewardToWinner","type":"uint256"}],"name":"Rewarded","type":"Event"},{"inputs":[{"name":"testCaseId","type":"uint256"},{"name":"testCase","type":"tuple"},{"name":"expected","type":"bytes[]"},{"name":"actual","type":"bytes[]"}],"name":"TestFailed","type":"Event"},{"inputs":[{"name":"testCaseId","type":"uint256"},{"name":"testCase","type":"tuple"},{"name":"expected","type":"bytes[]"},{"name":"actual","type":"bytes[]"}],"name":"TestPassed","type":"Event"},{"inputs":[{"name":"questionId","type":"uint256"},{"name":"winner","type":"address"}],"name":"WinnerAssigned","type":"Event"},{"inputs":[{"name":"_questionId","type":"uint256"},{"name":"_amount","type":"uint256"}],"name":"deposit","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"count","type":"uint256"}],"name":"getQuestionCount","stateMutability":"view","type":"function"},{"outputs":[{"type":"address"}],"name":"owner","stateMutability":"view","type":"function"},{"outputs":[{"type":"uint256"}],"inputs":[{"type":"uint256"},{"type":"uint256"}],"name":"prizePool","stateMutability":"view","type":"function"},{"inputs":[{"name":"questionAddr","type":"address"}],"name":"registerQuestion","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"address"}],"inputs":[{"type":"uint256"}],"name":"registeredQuestionList","stateMutability":"view","type":"function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"_questionId","type":"uint256"},{"name":"answerAddr","type":"address"}],"name":"verify","stateMutability":"Payable","type":"Function"},{"outputs":[{"type":"address"}],"inputs":[{"type":"uint256"}],"name":"winner","stateMutability":"view","type":"function"},{"inputs":[{"name":"_questionId","type":"uint256"}],"name":"withdrawByQuestionOwner","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_questionId","type":"uint256"}],"name":"withdrawByWinner","stateMutability":"Nonpayable","type":"Function"}]}];
        // let verifier = await tronWeb.contract(verifierAbi, verifierAddr);
        let verifier = await tronWeb.contract().at(verifierAddr);
        const questionCountHex = await verifier
          .getQuestionCount()
          .call({ _isConstant: true });
        const questionCount = parseInt(tronWeb.toDecimal(questionCountHex));
        console.log("questionCount-----" + questionCount);
        window.localStorage.setItem("lastQuestion", questionCount);
        if (questionCount > 0) {
          const questionHex = await verifier
            .registeredQuestionList(id)
            .call({ _isConstant: true });
          console.log("questionHex-----" + questionHex);
          let questionObj = await tronWeb.contract().at(questionHex);
          const desc = await questionObj
            .description()
            .call({ _isConstant: true });
          console.log("desc-----" + desc);
          const testCases = await questionObj.getTestCases().call();
          console.log("testCases-----" + testCases);
          let info = {
            questionId: questionId,
            questionAddress: {
              hex: questionHex,
              base58: tronWeb.address.fromHex(questionHex),
            },
            description: desc,
            testCases: testCases,
          };
          setQuestionInfo(info);
          console.log(`info is ${info}`);
        }
      } else {
        window.localStorage.setItem("lastQuestion", 0);
      }
      window.localStorage.setItem("currentQuestion", parseInt(questionId));
      window.localStorage.setItem("firstQuestion", 0);
    }

    fetchQuestionInfo(questionId, window.tronWeb, verifierAddr);
  }, [questionId, verifierAddr]);

  const handleVerify = async () => {
    console.log(questionId);
    const tronWeb = window.tronWeb;
    if (tronWeb) {
      if (!answerAddress) {
        message.info("please input answer address!");
        return;
      }
      let _2usd = await tronWeb.contract().at("TX3ueji8qE89vmykLor4QtdwXHQpePh8kD");
      let totalSupply = await _2usd.totalSupply().call({ _isConstant: true });
      console.log("totalSupply: " + totalSupply);
    } else {
      message.info("Please connect TronLink wallet!");
    }
  };

  const handleWithdraw = async () => {};

  const handleRegisterQuestion = async () => {
    const tronWeb = window.tronWeb;
    if (tronWeb) {
      if (!questionAddress) {
        message.info("please input question address!");
        return;
      }
      let _2usd = await tronWeb.contract().at("TX3ueji8qE89vmykLor4QtdwXHQpePh8kD");
      let totalSupply = await _2usd.totalSupply().call({ _isConstant: true });
      console.log("totalSupply: " + totalSupply);
    } else {
      message.info("Please connect TronLink wallet!");
    }
  };

  const updateAnswerAddress = (e) => {
    console.log(e.target.value);
    setAnswerAddress(e.target.value);
  };
  const updateQuestionAddress = (e) => {
    console.log(e.target.value);
    setQuestionAddress(e.target.value);
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
          <p>
            input [1, 1]
            <br />
            output 2
          </p>
        </div>
      </div>
      <div className="verify-box">
        <Input
          className="answer-address"
          placeholder="Answer Address"
          onChange={updateAnswerAddress}
          defaultValue={answerAddress}
          maxLength={64}
        />
        <Button type="primary" className="btn" onClick={handleVerify}>
          Verify
        </Button>
        <Button type="default" className="btn" onClick={handleWithdraw}>
          Withdraw
        </Button>
      </div>
      <div className="register-question-box">
        <Input
          className="question-address"
          placeholder="Question Address"
          onChange={updateQuestionAddress}
          defaultValue={questionAddress}
          maxLength={64}
        />
        <Button type="primary" className="btn" onClick={handleRegisterQuestion}>
          Register Question
        </Button>
      </div>
    </>
  );
};

export default Question;
