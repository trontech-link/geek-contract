export const checkQuestionId = (questionId, questionCount) => {
  if (isNaN(questionId)) {
    console.error(`Invalid questionId ${questionId}`);
    return false;
  }

  if (parseInt(questionId) > parseInt(questionCount) || parseInt(questionId) < 0) {
    console.error(`questionId ${questionId} is not in question list`);
    return false;
  }

  return true;
}