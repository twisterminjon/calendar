export const labelsColor = [
    "indigo",
    "gray",
    "green",
    "blue",
    "red",
    "purple",
  ];
  
export const labelsText = [
    "indigo1",
    "gray1",
    "green1",
    "blue1",
    "red1",
    "purple1",
  ];
  export  const labelsCol = [
    {
      "col": "indigo",
      "lab": "Актуальные"
    },
    {
      "col": "gray",
      "lab": "Школьнику"
    },
    {
      "col": "green",
      "lab": "Студенту"
    },
    {
      "col": "blue",
      "lab": "Ученому"
    },
    {
      "col": "red",
      "lab": "МСП"
    },
    {
      "col": "purple",
      "lab": "Университету"
    },
  ];

  export const getColor = (label) => {
    for(let i = 0; i<labelsCol.length;i++) {
      if(labelsCol[i].lab === label) {
        return labelsCol[i].col
      }
    }
  }