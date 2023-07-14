import axios from "axios";
import { useEffect, useState } from "react";
import ReactRouterPrompt from "react-router-prompt";

const userId = 1;

const StopWatch = () => {
  const [time, setTime] = useState({hours: 0, minutes: 0, seconds: 0});
  const [isRunning, setIsRunning] = useState(false);
  const [failAlert, setFailAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [workLogDate, setWorkLogsData] = useState("");
  const [workLogStartTime, setWorkLogStartTime] = useState("");
  const [workLogEndTime, setWorkLogEndTime] = useState("");
  const [workLogTime, setWorkLogTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          let { hours, minutes, seconds } = prevTime;
          seconds++;

          if (seconds === 60) {
            seconds = 0;
            minutes++;
          }

          if (minutes === 60) {
            minutes = 0;
            hours++;
          }

          return { hours, minutes, seconds };
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setTime({hours: 0, minutes: 0, seconds: 0});
      }
    };
  }, [isRunning]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());

    return `${year}-${month}-${day}`;
  }

  const formatTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const padZero = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const startHandler = () => {
    setIsRunning(true);
    setWorkLogsData(formatDate(new Date()));
    setWorkLogStartTime(formatTime(new Date()));
  }

  const stopHandler = async() => {
    setIsRunning(false);
    setWorkLogEndTime(formatTime(new Date()));
    setWorkLogTime((time.hours * 3600) + (time.minutes * 60) + time.seconds);
    try {
      await axios.post(`http://localhost:8080/work-logs/user-id/${userId}`, {
        userId: userId,
        workLogDate: workLogDate,
        workLogStartTime: workLogStartTime,
        workLogEndTime: workLogEndTime,
        workLogTime: workLogTime
      }).then(() => {
        setSuccessAlert(true);
      });
    } catch(err) {
      console.log(err);
      setFailAlert(true);
    }
  }

  return (
    <>
      {
        successAlert && (
          <div className="bg-teal-100 border border-teal-400 text-teal-700 px-4 py-3 rounded flex" role="alert">
            <span className="block sm:inline">作業記録が保存されました！</span>
            <span>
              <svg className="fill-current h-6 w-6 text-teal-500" role="button" onClick={() => setSuccessAlert(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )
      }
      {
        failAlert && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex" role="alert">
            <span className="block sm:inline">予期せぬエラーが発生し、作業記録が保存できませんでした！</span>
            <span>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" onClick={() => setFailAlert(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )
      }
      <p className="text-9xl tabular-nums">
        <span>{`${time.hours.toString().padStart(2, "0")}:`}</span>
        <span>{`${time.minutes.toString().padStart(2, "0")}:`}</span>
        <span>{`${time.seconds.toString().padStart(2, "0")}`}</span>
      </p>
      <ReactRouterPrompt when={isRunning} >
        {({ isActive, onConfirm, onCancel }) =>
          isActive && (
            <div className="bg-gray-500 inset-0 fixed z-30 bg-opacity-50">
              <div id="popup-modal" tabIndex={-1} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 overflow-x-hidden overflow-y-auto max-h-full">
                  <div className="relative w-full max-w-md max-h-full">
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                          <div className="p-6 text-center">
                              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">作業中のままページを移動すると作業時間は保存されません！ページを移動しますか？</h3>
                              <button type="button" onClick={onConfirm} data-modal-hide="popup-modal" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                  はい！移動します！
                              </button>
                              <button type="button" onClick={onCancel} data-modal-hide="popup-modal" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">いいえ！移動しません！</button>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          )
        }
      </ReactRouterPrompt>
      <div className="mt-20 flex">
        <button disabled={isRunning} onClick={startHandler} className="bg-dark-gray py-3 px-5 rounded-lg text-xl hover:opacity-50 focus:opacity-50 mx-3  disabled:opacity-50 disabled:cursor-not-allowed">業務開始</button>
        <button disabled={!isRunning} onClick={stopHandler} className="bg-dark-gray py-3 px-5 rounded-lg text-xl hover:opacity-50 focus:opacity-50 mx-3  disabled:opacity-50 disabled:cursor-not-allowed">業務終了</button>
      </div>
    </>
  );
}

export default StopWatch;