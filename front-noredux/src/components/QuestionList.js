import { useEffect, useState } from "react";
import { List, Typography } from "antd";
import InfiniteScroll from 'react-infinite-scroll-component';

const QuestionList = () => {
  const verifierAddr = process.env.REACT_APP_verifier;
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    console.log("QuestionList fetching, window.tronWeb=", verifierAddr, window.tronWeb);
    async function fetchQuestionList(tronWeb) {
      if (tronWeb) {
        console.log("fetchQuestionList tronWeb:   ", tronWeb);
        let verifier = await tronWeb.contract().at(verifierAddr);
        console.log("fetchQuestionList verifier: ", verifier);
        const questionCountHex = await verifier
          .getQuestionCount()
          .call({ _isConstant: true });
        const cnt = parseInt(tronWeb.toDecimal(questionCountHex));
        console.log("[QeustionList] cnt-----" + cnt);
        setQuestionCount(cnt);
      }
    }
    fetchQuestionList(window.tronWeb);
  }, [verifierAddr]);

  const listItems = Array(questionCount)
    .fill(null)
    .map((_, i) => i)
    .map((i) => `Question ${i}`);

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
