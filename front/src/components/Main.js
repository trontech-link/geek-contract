import { Layout } from "antd";
import AppHeader from "./Header";
import { Outlet, useMatch } from "react-router-dom";
import QuestionList from "./QuestionList";

const Main = () => {
  const match = useMatch("/questions/:questionId");

  return (
    <Layout>
      <AppHeader />
      <div className="main">
        <div className="content">{match ? <Outlet /> : <QuestionList />}</div>
      </div>
    </Layout>
  );
};

export default Main;
