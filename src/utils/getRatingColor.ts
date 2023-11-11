export const getRatingColorBG = (avg : number) => {
  if(avg >= 0 && avg < 4){
    return 'bg-red-500'
  } else if (avg >= 4 && avg < 7) {
    return 'bg-yellow-500'
  } else if (avg >= 7 && avg <= 10) {
    return 'bg-teal'
  } 
}

export const getRatingColorText = (avg : number) => {
  if(avg >= 0 && avg < 4){
    return 'text-red-400'
  } else if (avg >= 4 && avg < 7) {
    return 'text-yellow-500'
  } else if (avg >= 7 && avg < 10) {
    return 'text-green-400'
  } else if (avg === 10) {
    return 'text-blue-400'
  }
}