const baseStore = function(data) {
  console.log("initalize store");
  this.qs = data;
  this.totalQs = data.length;
  this.currentQN = 0;
  this.currentQ = data[0];
  this.answers = {};
};

baseStore.prototype.getNextQ = function() {
  if (this.currentQN === this.qs.length) {
    return null;
  }

  const nextQ = this.qs[this.currentQN + 1];
  this.currentQ = nextQ;
  this.currentQN = this.currentQN + 1;
  return nextQ;
};
baseStore.prototype.skipCurrentQ = function() {
  this.answers[this.currentQ.id] = { answers: [] };
};

baseStore.prototype.updateAnswers = function(qid, oid, ismulti) {
  if (!qid) {
    return;
  }
  if (this.answers[qid]) {
    if (ismulti === "true") {
      this.answers[qid].answers[oid] = !this.answers[qid].answers[oid];
    } else {
      this.answers[qid].answers = {
        [oid]: true
      };
    }
  } else {
    this.answers[qid] = {
      answers: {
        [oid]: true
      },
      ismulti
    };
  }
};

baseStore.prototype.isMinOneAnswerSelected = function(qid) {
  let flag = false;
  if (this.answers[qid]) {
    for (let key in this.answers[qid].answers) {
      if (this.answers[qid].answers.hasOwnProperty(key)) {
        flag = flag || this.answers[qid].answers[key];
      }
    }
  } else {
    return false;
  }

  return flag;
};

export default baseStore;
