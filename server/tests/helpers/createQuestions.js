const Question = require("../../models/Question");
const questions = require("../fixtures/questions");
// const createUser = require("../helpers/createUser");
// const users = require("../fixtures/users");
const createQuestions = async (
    adminId,
    subject = null
) => {

    const docs = questions.map((q) => ({

        ...q,

        subject: subject || q.subject,

        createdBy: adminId,

    }));

    return await Question.insertMany(docs);

};

module.exports = createQuestions;