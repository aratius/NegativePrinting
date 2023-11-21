const getHeader = (places, dates) => {
  const getDateStr = (date) => {
    return `${Number(date.slice(0, 2))}/${Number(date.slice(2, 4))}/'23`;
  };
  let dateStr = "";
  dateStr += getDateStr(dates[0]);
  if (dates.length > 1) dateStr += ` - ${getDateStr(dates[dates.length - 1])}`;

  return `{w:35}


 ^^^\`${dateStr}\`

 Negative Printing / 2023
 arata matsumoto


 {w:35}
 ${places.join("-")}

 `;
};

const getText = (text) => {
  return `{w:35}
|${text}`;
};

const getFooter = (note) => {
  return `

  {w:35}
\\===================================

{w:25,10}
|Subtotal | 123EUR|
|Tax(10%) | 456EUR|
|^^Total | ^^789EUR|


{code:${note}; option:qrcode,5,L}

{code:202309021002; option:code128,4,72}

`;
};

module.exports = { getHeader, getFooter, getText };