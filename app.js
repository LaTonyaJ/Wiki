const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// mongoose.connect('mongodb+srv://admin-latonya:Test123@cluster0.mny17.mongodb.net/WikiDB');

mongoose.connect('mongodb://localhost:27017/WikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);


app.route('/articles')
    .get((req, res) => {
        Article.find({}, (err, articles) => {
            if (!err) {
                if (articles.length === 0) {

                    Article.create({
                        title: 'Welcome to Your Wiki!',
                        content: 'Put together a research wiki for full-stack development'
                    }, (err, article) => {
                        if (!err) {
                            res.send(article);
                        }
                    });
                }
                // } else {
                //     console.log(err)
                // }
                res.send(articles);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });


        newArticle.save((err) => {
            if (!err) {
                res.send('New article successfully saved');
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send('All articles deleted')
            } else {
                res.send(err)
            }
        });
    });

////////////////////Specific Articles///////////////////////////


app.route('/articles/:name')
    .get((req, res) => {

        Article.findOne({ title: req.params.name }, (err, article) => {
            if (article) {
                res.send(article);
            } else {
                res.send(`No matching title:`, req.params.name);
            }
        });
    })

    .put((req, res) => {

        const result = Article.replaceOne(
            { title: req.params.name },
            { title: req.body.title, content: req.body.content },
            (err, result) => {
                if (result.acknowledged === true) {
                    res.send("Article Successfully updated");
                } else {
                    res.send(err);
                }
            });

    })

    .patch((req, res) => {

        Article.updateOne({ title: req.params.name }, { title: req.body.title, content: req.body.content }, (err, results) => {
            if (!err && results.acknowledged === true) {
                res.send('Update successful');
            } else {
                console.log(err);
            }
        });
    })

    .delete((req, res) => {
        Article.findOneAndDelete(
            { title: req.params.name },
            (err, result) => {
                if (!err) {
                    res.send('Article deleted');
                } else {
                    res.send(err);
                }
            });
    });


var port = process.env.PORT;
if (!port) {
    port = 3000;
};

app.listen(port, () => {
    console.log('Server started on Port 3000');
});