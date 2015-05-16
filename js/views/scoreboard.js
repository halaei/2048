function Scorboard(score_div, highscore_div, score, highscore)
{
    this.score_div = score_div;
    this.highscore_div = highscore_div;
    this.score = score;
    this.highscore = highscore;
    this.showScore();
}

Scorboard.prototype.increaseScore = function(increment)
{
    this.score += increment;
    if(this.highscore < this.score)
    {
        this.highscore = this.score;
    }
    this.showScore();
}

Scorboard.prototype.showScore = function()
{
    this.score_div.innerHTML = this.score;
    this.highscore_div.innerHTML = this.highscore;
}