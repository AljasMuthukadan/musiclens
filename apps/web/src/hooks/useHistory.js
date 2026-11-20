import { useState } from "react";


export default function useHistory() {
   const [history, setHistory] = useState([]);

   const addToHistory = (analysis) => {
      setHistory((prevHistory) => [analysis, ...prevHistory]);
   };

   const clearHistory = () => {
      setHistory([]);
   };

   return {
      history,
      addToHistory,
      clearHistory,
   };


}