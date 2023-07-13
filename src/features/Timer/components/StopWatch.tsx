import { useEffect, useState } from "react";
import ReactRouterPrompt from "react-router-prompt";

const StopWatch = () => {
  const [time, setTime] = useState({hours: 0, minutes: 0, seconds: 0});
  const [isRunning, setIsRunning] = useState(false)

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

  const startHandler = () => {
    setIsRunning(true);
  }

  const stopHandler = () => {
    setIsRunning(false);
  }

  return (
    <>
      <p className="text-9xl tabular-nums">
        <span>{`${time.hours.toString().padStart(2, "0")}:`}</span>
        <span>{`${time.minutes.toString().padStart(2, "0")}:`}</span>
        <span>{`${time.seconds.toString().padStart(2, "0")}`}</span>
      </p>
      {/* <ReactRouterPrompt when={time.seconds > 0} > */}
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