import { useEffect } from "react";
import { message, Button } from "antd";
import tronLogo from "../assets/images/tron.svg";
import "../assets/styles/header.css";
import { LeftOutlined, RightOutlined, MenuOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTronObj, setCurrentAccount } from "../app/rooterReducer";

const AppHeader = () => {
  const { questionId } = useParams();
  const currentAccount = useSelector((state) => state.rooter.currentAccount);
  const firstQuestion = useSelector((state) => state.rooter.firstQuestionId);
  const lastQuestion = useSelector((state) => state.rooter.lastQuestionId);
  const dispatch = useDispatch();
  const matchQuestion = useMatch("/questions/:questionId");
  const navigate = useNavigate();

  const initTronWeb = (tronWeb) => {
    console.log("initTronWeb tronWeb" + tronWeb);
    tronWeb.setFullNode(process.env.REACT_APP_tronweb_fullHost);
    tronWeb.setHeader({
      "TRON-PRO-API-KEY": process.env.REACT_APP_tronweb_apikey,
    });
    window.tronWeb = tronWeb;
    const account = tronWeb.defaultAddress.base58;
    dispatch(setTronObj({ tronWeb: tronWeb }));
    dispatch(setCurrentAccount(account));
    console.log("currentAccount=" + account);
  };

  const initTronLinkWallet = async () => {
    try {
      const tronLinkPromise = new Promise((resolve) => {
        window.addEventListener(
          "tronLink#initialized",
          async () => {
            return resolve(window.tronLink);
          },
          {
            once: true,
          }
        );

        setTimeout(() => {
          if (window.tronLink) {
            return resolve(window.tronLink);
          } else {
            return resolve(false);
          }
        }, 3000);
      });

      const appPromise = new Promise((resolve) => {
        let timeCount = 0;
        const tmpTimer = setInterval(() => {
          timeCount++;
          if (timeCount > 8) {
            clearInterval(tmpTimer);
            return resolve(false);
          }

          if (window.tronLink) {
            clearInterval(tmpTimer);
            if (window.tronLink.ready) {
              return resolve(window.tronLink);
            }
          } else if (
            window.tronWeb &&
            window.tronWeb.defaultAddress &&
            window.tronWeb.defaultAddress.base58
          ) {
            clearInterval(tmpTimer);
            return resolve(window.tronWeb);
          }
        }, 1000);
      });

      Promise.race([tronLinkPromise, appPromise]).then((tron) => {
        if (!tron) {
          message.info("Please install TronLink");
          console.log("TronLink is not initialized");
          closeConnect();
          return;
        }

        if (tron && tron.defaultAddress && tron.defaultAddress.base58) {
          console.log("tronWeb is initialized already, just setting");
          initTronWeb(tron);
          return;
        }

        const tronLink = tron;
        if (tronLink.ready) {
          const tronWeb = tronLink.tronWeb;
          tronWeb && initTronWeb(tronWeb);
          console.log("tronLink is ready, just setting");
          return;
        } else {
          const res = tronLink.request({ method: "tron_requestAccounts" });
          console.log(`tron_requestAccounts res = ${JSON.stringify(res)}`);
          if (!res.code) {
            message.info("Please create or import wallet account via TronLink");
          } else {
            if (res.code === 200) {
              const tronWeb = tronLink.tronWeb;
              tronWeb && initTronWeb(tronWeb);
              console.log("get tronWeb from tron_requestAccounts");
              return;
            }
            if (res.code === 4001) {
              console.log("Please check TronLink chrome extension");
            }
          }
          closeConnect();
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnect = () => {
    dispatch(setTronObj({}));
    dispatch(setCurrentAccount(""));
  };

  useEffect(() => {
    const listenTronLink = () => {
      window.addEventListener("message", (res) => {
        if (res.data.message && res.data.message.action === "accountsChanged") {
          console.log(res.data, res.data.message, "accountsChanged");
          return window.location.reload();
        }
        if (res.data.message && res.data.message.action === "setAccount") {
          console.log(res.data, res.data.message, "setAccount");
          if (
            window.tronWeb &&
            !window.tronLink &&
            res.data.message.data.address !== currentAccount
          ) {
            return window.location.reload();
          }
        }
        if (res.data.message && res.data.message.action === "setNode") {
          console.log(res.data, res.data.message, "setNode");
          return window.location.reload();
        }
        // disconnectWebsite
        if (res.data.message && res.data.message.action === "disconnectWeb") {
          console.log(res.data, res.data.message, "disconnectWeb");

          return window.location.reload();
        }
        // connectWebsite
        if (res.data.message && res.data.message.action === "connectWeb") {
          console.log(res.data, res.data.message, "connectWeb");
          return window.location.reload();
        }
      });
    };
    listenTronLink();
  });
  useEffect(() => {
    initTronLinkWallet();
  });

  const previousQuestion = () => {
    console.log(
      `previousQuestion currentQuestion: ${questionId}, firstQuestion: ${firstQuestion}`
    );
    if (questionId > firstQuestion) {
      const prevId = parseInt(questionId) - 1;
      navigate(`/questions/${prevId}`);
    } else {
      message.info("it's first question!");
    }
  };
  const nextQuestion = () => {
    console.log(
      `previousQuestion currentQuestion: ${questionId}, lastQuestion: ${lastQuestion}, type of currentQuestion: ${typeof currentQuestion}`
    );
    if (questionId < lastQuestion) {
      const nextId = parseInt(questionId) + 1;
      navigate(`/questions/${nextId}`);
    } else {
      message.info("it's last question!");
    }
  };

  return (
    <>
      <div className="flex header-box">
        <div className="flex header-left">
          <img src={tronLogo} className="tron-logo" alt="" />
        </div>
        {matchQuestion ? (
          <div className="flex header-center">
            <Button onClick={previousQuestion}>
              <LeftOutlined />
            </Button>
            <span className="question-list">
              <MenuOutlined /> Question List
            </span>
            <Button onClick={nextQuestion}>
              <RightOutlined />
            </Button>
          </div>
        ) : (
          <></>
        )}
        <div className="flex header-right">
          <Button className="connect-wallet" onClick={initTronLinkWallet}>
            {currentAccount && currentAccount.length > 0
              ? currentAccount
              : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
