function Scorboard(score_div, highscore_div, score, storage)
{
    this.score_div = score_div;
    this.highscore_div = highscore_div;
    this.score = score;
    this.storage = storage;
    this.highscore = storage.getBestScore();
    this.showScore();
}

Scorboard.prototype.showScore = function()
{
    this.score_div.innerHTML = this.score;
    this.highscore_div.innerHTML = this.highscore;
};

Scorboard.prototype.update = function(score_event)
{
    this.score = score_event.new_score;
    if(this.highscore < this.score)
    {
        this.highscore = this.score;
        this.storage.setBestScore(this.score);
    }
    this.showScore();
};

Scorboard.prototype.register = function(game)
{
    game.on('UpdateScoreEvent', this, this.update);
};