import { useEffect, useState } from "react";
import { tronObj } from "../utils/blockchain";
import { List } from "antd";
import InfiniteScroll from 'react-infinite-scroll-component';

const QuestionList = () => {
  const verifierAddr = process.env.REACT_APP_verifier;
  const [questionCount, setQuestionCount] = useState(0);

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
        setQuestionCount(cnt);
      }
    }
    fetchQuestionList();
  });

  const listItems = Array(questionCount)
    .fill(null)
    .map((_, i) => i)
    .map((i) => <li>Question {i}</li>);

  return (
    // <InfinityScroll>
    //   <List
    //     header="Question List"
        
    //   />
    // </InfinityScroll>
    <>
    <List
    
      header={<div>Question List</div>}

    />
      <ul>{listItems}</ul>
    </>
  );
};

export default QuestionList;
