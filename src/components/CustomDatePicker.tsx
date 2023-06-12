import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css"
import ja from 'date-fns/locale/ja';

import './CustomDatePicker.css';

registerLocale('ja', ja);

const CustomDatePicker = () => {
  const initialDate = new Date();
  const [startDate, setStartDate] = useState(initialDate);
  const dateChangeHandler = (date: Date) => {
    setStartDate(date);
  }

  return (
    <DatePicker
      locale="ja"
      showIcon
      selected={startDate}
      onChange={dateChangeHandler}
      dateFormat="yyyy/MM"
      showMonthYearPicker
      className="bg-gray-50 border border-gray-500 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 hover:cursor-pointer"
    />
  );
}

export default CustomDatePicker;