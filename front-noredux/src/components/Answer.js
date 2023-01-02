import { Col } from "antd";
import '../assets/styles/answer.css';

const Answer = () => {
    return (
        <Col span={12} className="answer-area">
            <div className="answer-header">
                <div className="answer-header-left">
                    <div className="answer-header-left-text">Answer</div>
                    <div className="answer-header-left-text-right"></div>
                </div>
            </div>
        </Col>
    );
};

export default Answer;