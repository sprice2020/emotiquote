import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import happyImg from './imgs/happy.png';
import sadImg from './imgs/sad.png';
import angerImg from './imgs/anger.png';
import fearImg from './imgs/fear.png';
import surpriseImg from './imgs/surprise.png';


class App extends Component {
  constructor() {
    super();
    this.state = {
      pageTitle: '',
      anger: .01,
      joy: .01,
      fear: .01,
      sadness: .01,
      surprise: .01,
      beginning: '',
      quoteType: "",
      quote: "",
      quoteTypeTwo: "",
      quoteTwo: "",
      joyWidth: '0%',
      sadnessWidth: '0%',
      angerWidth: '0%',
      surpriseWidth: '0%',
      fearWidth: '0%',
      relResult: 'Created by: Michelle Pine, Abigail Hodge, Sharon He, and Sam Price',
      quoteTextOne: '',
      quoteTextTwo: '',

    }

  }






  handleSubmit(e) {
    e.preventDefault();
    if (this.refs.search.value === '') {
      alert('Search text is required');
    }
    else {
      this.getQuotes(this.refs.search.value);
    }


  }


  render() {
    var percentageJoy = this.state.joyWidth;
    var percentageAnger = this.state.angerWidth;
    var percentageFear = this.state.fearWidth;
    var percentageSurprise= this.state.surpriseWidth;
    var percentageSadness = this.state.sadnessWidth;
    return (

      <div className="App">
        <div className="d-flex px-3 my-auto pl-sm-0 pr-sm-0">
          <div className="main card my-auto p-3 mx-auto">
            <h1 className="siteTitle mt-3">Emotiquote</h1>
            <p className="description mx-auto py-4">Search a person, movie, book, or tv show to analyze the emotions behind their quotes. </p>
            <form className="form mx-auto mb-3" onSubmit={this.handleSubmit.bind(this)}>
              <div className="my-search-form">
                <input className="searchForm" type="text" placeholder="search..." ref="search" />
              </div>
              <input className="btn" type="submit" value="go" />
            </form>


            <div className="title2"><span className="font-15">{this.state.relResult}</span><br></br>{this.state.pageTitle}</div>
            <p className="mx-auto mb-3 mt-3 text-center font-15 width-75">{this.state.beginning}
            </p>
            <div className="card-block quote mx-auto">
              <blockquote className="mx-auto">&nbsp;
                {this.state.quote}&nbsp;<span className="quote-desc">{this.state.quoteTextOne}{this.state.quoteType}</span>
            </blockquote>
            <div className="card-block quote mx-auto">
              <blockquote className="mx-auto">&nbsp;
                {this.state.quoteTwo}&nbsp;<i className="fas fa-quote-right"></i> <span className="quote-desc">{this.state.quoteTextTwo}{this.state.quoteTypeTwo}</span>
            </blockquote>
          </div>


          <div className="bars ml-auto">
            <div className="progress">
              <div className="limit"><div className="progress-bar progress-bar-striped" role="progressbar" style={{width : percentageJoy}} aria-valuenow={this.state.joy} aria-valuemin="0" aria-valuemax={this.state.joy}>{this.state.joyWidth}</div></div>
            </div><div className="emotion"> &nbsp;Joy&nbsp;&nbsp;<img src={happyImg} className="emoji" alt="happy face"/></div>


            <div className="progress">
              <div className="progress-bar progress-bar-striped" role="progressbar" style={{width : percentageAnger}} aria-valuenow={this.state.anger} aria-valuemin="0" aria-valuemax="100">{this.state.angerWidth}</div>
            </div><div className="emotion"> &nbsp;Anger&nbsp;&nbsp;<img src={angerImg} className="emoji" alt="angry face"/></div>
            <div className="progress">
              <div className="progress-bar progress-bar-striped" role="progressbar" style={{width : percentageSadness}} aria-valuenow={this.state.sadness} aria-valuemin="0" aria-valuemax="100">{this.state.sadnessWidth}</div>
            </div><div className="emotion"> &nbsp;Sadness&nbsp;&nbsp;<img src={sadImg} className="emoji" alt="sad face"/></div>
            <div className="progress">
              <div className="progress-bar progress-bar-striped" role="progressbar" style={{width : percentageSurprise}} aria-valuenow={this.state.surprise} aria-valuemin="0" aria-valuemax="100">{this.state.surpriseWidth}</div>
            </div><div className="emotion"> &nbsp;Surprise&nbsp;&nbsp;<img src={surpriseImg} className="emoji" alt="surprised face"/></div>
            <div className="progress">
              <div className="progress-bar progress-bar-striped" role="progressbar" style={{width : percentageFear}} aria-valuenow={this.state.fear} aria-valuemin="0" aria-valuemax="100">{this.state.fearWidth}</div>
            </div><div className="emotion"> &nbsp;Fear&nbsp;&nbsp;<img src={fearImg} className="emoji" alt="fearful face"/></div>



          </div>
        </div>
      </div>
    </div>










    <p></p>

  </div>
);
}

getPage(grabPageID, id) {
  $.ajax({
    async: false,
    url: 'https://en.wikiquote.org/w/api.php',
    dataType: 'jsonp',
    data: {
      action: 'query',
      list: 'search',
      srsearch: id,
      utf8: '',
      format: 'json',
    },

    cache: false,
    success: function(thing) {
      var o = thing.query.search;
      if (o[0] === undefined) {
        grabPageID(-1, 'Bad Search');
      } else {
        var idx = o[0].pageid;
        var title = o[0].title;
        grabPageID(idx, title);
      }
    },

    error: function(xhr, status, err) {
      console.log('err');
    }
  })
}

getData(page, callback) {
  let p = String(page);
  $.ajax({
    async: false,
    url: 'https://en.wikiquote.org/w/api.php',
    dataType: 'jsonp',
    data: {
      action: 'query',
      pageids: page + '',
      prop: 'revisions',
      rvprop: 'content',
      format: 'json',
      formatversion: '2'
    },
    cache: false,
    success: function(pageData) {
      callback(pageData);
    }.bind(this),
    error: function(xhr, status, err) {
      console.log(err);
    }
  })
}

getEmote(data, callback) {
  $.post(
    'https://apiv2.indico.io/emotion/batch',
    JSON.stringify({
      'api_key': "601a9a72cc56692d1f388c608fa955b8",
      'data': data
    })

  ).then(function(res) {
    callback(JSON.parse(res));
  });
}

// to calculate average emotions for compilation of quotes
calcEmote(data, arr) {
  var a = 0;
  var aMax = 0;
  var aMaxTwo = 0;
  var aIndex = 0;
  var aIndexTwo = 0;

  var b = 0;
  var bMax = 0;
  var bMaxTwo = 0;
  var bIndex = 0;
  var bIndexTwo = 0;

  var c = 0;
  var cMax = 0;
  var cMaxTwo = 0;
  var cIndex = 0;
  var cIndexTwo = 0;

  var d = 0;
  var dMax = 0;
  var dMaxTwo = 0;
  var dIndex = 0;
  var dIndexTwo = 0;

  var e = 0;
  var eMax = 0;
  var eMaxTwo = 0;
  var eIndex = 0;
  var eIndexTwo = 0;

  for (var x = 0; x < data.length; x++) {
    a += data[x].anger;
    b += data[x].joy;
    c += data[x].fear;
    d += data[x].sadness;
    e += data[x].surprise;

    if (data[aIndex].anger < data[x].anger) {
      aMaxTwo = aMax;
      aMax = data[x].anger;
      aIndexTwo = aIndex;
      aIndex = x;
    }

    if (bMax < data[x].joy) {
      bMaxTwo = bMax;
      bMax = data[x].anger;
      bIndexTwo = bIndex;
      bIndex = x;
    }

    if (cMax < data[x].fear) {
      cMaxTwo = cMax;
      cMax = data[x].anger;
      cIndexTwo = cIndex;
      cIndex = x;
    }

    if (dMax < data[x].sadness) {
      dMaxTwo = dMax;
      dMax = data[x].anger;
      dIndexTwo = dIndex;
      dIndex = x;
    }

    if (eMax < data[x].surprise) {
      eMaxTwo = eMax;
      eMax = data[x].anger;
      eIndexTwo = eIndex;
      eIndex = x;
    }
  }

  a = a / data.length;
  b = b / data.length;
  c = c / data.length;
  d = d / data.length;
  e = e / data.length;

  this.setState({anger: a * 100});
  this.setState({joy: b * 100});
  this.setState({fear: c * 100 });
  this.setState({sadness: d * 100});
  this.setState({surprise: e * 100});
  this.setState({angerWidth: Math.floor(a * 100) + '%'});
  this.setState({joyWidth: Math.floor(b * 100) + '%'});
  this.setState({fearWidth: Math.floor(c * 100) + '%'});
  this.setState({sadnessWidth: Math.floor(d * 100) + '%'});
  this.setState({surpriseWidth: Math.floor(e * 100) + '%'});


  var nums = [a, b, c, d, e];
  nums = nums.sort();
  var max = nums[4];
  if (max === a) {
    this.setState({quoteType: "angry"});
    this.setState({quote: arr[aIndex]});
  } else if (max === b) {
    this.setState({quoteType: "joy"});
    this.setState({quote: arr[bIndex]});
  } else if (max === c) {
    this.setState({quoteType: "fear"});
    this.setState({quote: arr[cIndex]});
  } else if (max === d) {
    this.setState({quoteType: "sadness"});
    this.setState({quote: arr[dIndex]});
  } else {
    this.setState({quoteType: "surprise"});
    this.setState({quote: arr[eIndex]});
  }
  var twoMax = nums[3];
  if (twoMax === a) {
    this.setState({quoteTypeTwo: "angry"});
    this.setState({quoteTwo: arr[aIndexTwo]});
  } else if (twoMax === b) {
    this.setState({quoteTypeTwo: "joy"});
    this.setState({quoteTwo: arr[bIndexTwo]});
  } else if (twoMax === c) {
    this.setState({quoteTypeTwo: "fear"});
    this.setState({quoteTwo: arr[cIndexTwo]});
  } else if (twoMax === d) {
    this.setState({quoteTypeTwo: "sadness"});
    this.setState({quoteTwo: arr[dIndexTwo]});
  } else {
    this.setState({quoteTypeTwo: "surprise"});
    this.setState({quoteTwo: arr[eIndexTwo]});
  }


}


parseString(messy) {
  var re = /[a-zA-Z,'-\s]+[.?!]/g;
  var matches = messy.match(re);
  return matches;

}

getQuotes(searchItem) {
  var page = this.getPage(function(pageId, tle){
    if (pageId === -1) {
      this.setState({pageTitle: 'Bad search'});
      this.setState({quotes: ['THIS IS A BAD SEARCH']});
    } else {
      this.setState({pageTitle: tle});
      this.setState({isBadSearch: false});
      this.getData(pageId, function(revisions) {
        var thing = revisions.query.pages[0].revisions[0].content;
        var begre = /.*\=/;
        var nullcheck = thing.match(begre);
        if (nullcheck) {
          this.setState({relResult: 'Closest result',
            quoteTextOne: 'Most Emotional Quote - ',
            quoteTextTwo: 'Second Most Emotional Quote - '});
            var endidx = thing.match(begre).index;
            var begin = thing.substring(0, endidx);
            var cleanreg1 = /\[|\]|{{.*}}|w:[^\|]*\||<.*>/;
            var splitarr = begin.split(cleanreg1);
            begin = splitarr.join(' ');
            this.setState({beginning: begin});

            var arr = this.parseString(thing.substring(endidx));
            if (arr === null) {
              this.setState({quotes: ['Please be more specific']});
            } else {
              var emotions = this.getEmote(arr, function(dataset){
                this.calcEmote(dataset.results, arr);
              }.bind(this));
            }
          } else {
            this.setState({beginning: 'Error: Please be more specific or try new entry'});
          }
        }.bind(this));
      } }.bind(this), searchItem);

    }


  }

  export default App;
