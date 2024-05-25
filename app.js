const express = require('express')
const path = require('path');
const OpenAI = require('openai');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express()
const openai = new OpenAI(process.env.OPENAI_API_KEY)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/generate-study-guide', async (req, res) => {
    const {topic, difficulty, priorKnowledge} = req.body;
    
    const prompt = `
    You are an experienced virtual tutor and learning expert. Create an in-depth study guide for the topic of ${topic}.
    The study guide should be specifically designed for a ${difficulty} level learner.
    The learner has the following prior knowledge: ${priorKnowledge}.
    
    The study guide must include the following sections:
  
       - List and describe the essential concepts and subtopics that the learner should focus on.
       - Provide a structured plan or sequence to study these concepts.
  
       - Identify the hardest concepts or areas within the topic.
       - Offer strategies and techniques to overcome these challenges.
       - Include examples or analogies to simplify complex ideas.
  
       - Share effective study habits and techniques ONLY tailored for this specific topic.
     - Recommend high-quality resources such as books, online courses, videos, articles, and forums.
       - Provide links or references to these resources.
       - Highlight any prerequisites needed to use these resources effectively.
  
       - Suggest practical exercises, projects, or experiments related to the topic.
       - Recommend platforms or tools where the learner can practice and apply their knowledge.
  
    The study guide should be detailed, well-structured, and written in a clear and engaging manner to facilitate effective learning, and should also be in simple english that the reader can understand and benefit from, it should be light and conversational, almost like a person wrote it. 
  
  
    `

    try {
        const completion = await openai.chat.completions.create({
            messages: [{role: 'user', content: prompt}],
            model: 'gpt-3.5-turbo'
        })

        const studyGuide = completion.choices[0].message.content;
        res.json({ studyGuide} )
    } catch (error) {
        console.error("error generating the output")
        res.json({studyGuide: "error generating study guide"})
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
