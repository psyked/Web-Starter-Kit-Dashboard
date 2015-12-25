var DAYS = 90;
//var COUNT = 10;

function accentsTidy(s) {
  var r = s.toLowerCase();
  //r = r.replace(new RegExp(/\s/g), "");
  r = r.replace(new RegExp(/[àáâãäå]/g), "a");
  r = r.replace(new RegExp(/æ/g), "ae");
  r = r.replace(new RegExp(/ç/g), "c");
  r = r.replace(new RegExp(/[èéêë]/g), "e");
  r = r.replace(new RegExp(/[ìíîï]/g), "i");
  r = r.replace(new RegExp(/ñ/g), "n");
  r = r.replace(new RegExp(/[òóôõö]/g), "o");
  r = r.replace(new RegExp(/œ/g), "oe");
  r = r.replace(new RegExp(/[ùúûü]/g), "u");
  r = r.replace(new RegExp(/[ýÿ]/g), "y");
  //r = r.replace(new RegExp(/\W/g), "");
  return r;
}
//function renderLeaderboard(commits, avatars, panel) {
//  var units = d3.select(panel).attr('data-timeunit');
//
//  if(units) {
//    var previousResults = d3.nest()
//      .key(function(d) {
//        return d.author;
//      })
//      .rollup(function(leaves) {
//        return leaves.length;
//      })
//      .entries(commits.filter(function(d) {
//        var startDate = moment().add(-2, units).startOf(units);
//        var endDate = moment().add(-1, units).startOf(units);
//        var theDate = new Date(d.date);
//        return !!(theDate > startDate && theDate < endDate);
//      }))
//      .sort(function(a, b) {
//        return d3.descending(a.values, b.values);
//      });
//  }
//
//  var results = d3.nest()
//    .key(function(d) {
//      return d.author;
//    })
//    .rollup(function(leaves) {
//      return leaves.length;
//    })
//    .entries(commits.filter(function(d) {
//      if(units) {
//        var startDate = moment().add(-1, units).startOf(units);
//        var endDate = moment().startOf(units);
//        var theDate = new Date(d.date);
//        return !!(theDate > startDate && theDate < endDate);
//      } else {
//        return true;
//      }
//    }))
//    .sort(function(a, b) {
//      return d3.descending(a.values, b.values);
//    })
//    .splice(0, COUNT);
//
//  results.forEach(function(d, i) {
//    var moveIndex = "";
//    if(units) {
//      var oldIndex = previousResults.length;
//      for(var j = 0; j < previousResults.length; j += 1) {
//        if(previousResults[j]['key'] === d.key) {
//          oldIndex = j;
//        }
//      }
//      moveIndex = '<i class="fa fa-minus move-icon"></i>';
//      if(oldIndex > i) {
//        moveIndex = '<i class="fa fa-arrow-up move-icon up"></i>';
//      } else if(oldIndex < i) {
//        moveIndex = '<i class="fa fa-arrow-down move-icon down"></i>';
//      }
//    }
//    d3.select(panel).select('.list').append('div').attr('class', 'commit').html(moveIndex + ' <span class="index">' + (i + 1) + '.</span> ' + '<span class="name">' + d.key + '</span> with ' + d.values.toLocaleString() + ' commits.');
//  });
//
//  var dataToCheck = results;
//
//  if(dataToCheck[0]) {
//    var firstImage = "";
//    avatars.forEach(function(d, i) {
//      if(d.key === dataToCheck[0].key) {
//        firstImage = d.values[0].key;
//      }
//    });
//    d3.select(panel).select('.avatars-area .first').append('img').attr('src', firstImage);
//  }
//
//  if(dataToCheck[1]) {
//    var secondImage = "";
//    avatars.forEach(function(d, i) {
//      if(d.key === dataToCheck[1].key) {
//        secondImage = d.values[0].key;
//      }
//    });
//    d3.select(panel).select('.avatars-area .second').append('img').attr('src', secondImage);
//  }
//
//  if(dataToCheck[2]) {
//    var thirdImage = "";
//    avatars.forEach(function(d, i) {
//      if(d.key === dataToCheck[2].key) {
//        thirdImage = d.values[0].key;
//      }
//    });
//    d3.select(panel).select('.avatars-area .third').append('img').attr('src', thirdImage);
//  }
//}

function toTitleCase(str) {
  return str.replace(/\b./g, function(m) {
    return m.toUpperCase();
  });
}

d3.csv('//raw.githubusercontent.com/psyked/ProjectStats/master/website/serve/output.json', function(error, commits) {
  // exclude data from outside the last DAYS days
  commits = commits.filter(function(d) {
    var startDate = moment().add(-DAYS, 'day').startOf('day');
    var endDate = moment().startOf('day');
    var theDate = new Date(d.date);
    return !!(theDate > startDate && theDate < endDate);
  });

  //var avatars = d3.nest()
  //  .key(function(d) {
  //    return d.author;
  //  })
  //  .key(function(d) {
  //    return d.avatar;
  //  })
  //  .rollup(function(leaves) {
  //    return leaves.author;
  //  })
  //  .entries(commits);

  //d3.selectAll('.toplist .panel').each(function(d, i) {
  //  renderLeaderboard(commits, avatars, this);
  //});

  var units = 'days';

  var results = d3.nest()
    .key(function(d) {
      d.author = d.author.split('_').join(' ');
      d.author = d.author.split('[').join("");
      d.author = d.author.split(']').join("");
      var rtn = accentsTidy(d.author);
      if(rtn.indexOf('<') !== -1) {
        rtn = toTitleCase(d.author.split('<')[0].trim());
      }
      rtn = toTitleCase(rtn.trim());
      //if(rtn.length === 0) {
      //  return false;
      //}
      return rtn;
    })
    //.key(function(d) {
    //  return d.author;
    //})
    .rollup(function(leaves) {
      return leaves.length;
    })
    .entries(commits.filter(function(d) {
      if(units) {
        var startDate = moment().add(-DAYS, units).startOf(units);
        var endDate = moment().startOf(units);
        var theDate = new Date(d.date);
        return !!(theDate > startDate && theDate < endDate);
      } else {
        return true;
      }
    }))
    .filter(function(d) {
      // todo: Tie this into the Bitbucket Team Group
      if(d.key.length === 0 || d.key === "Openenergygroup" || d.key === "Sbfsolutions" ||
        d.key === "MMT London Dev" || d.key === "Unknown" || d.key === "Mincy Kurian" || d.key.indexOf("@") !== -1
        || d.key === "Alex Hazell" || d.key === "Ben Squire" || d.key === "Bryn Dalton") {
        return false;
      }
      return true;
    })
    .sort(function(a, b) {
      return d3.ascending(a.key, b.key);
    });
  //.splice(0, COUNT);

  //console.log(results);

  //var results = d3.nest()
  //  .key(function(d) {
  //    d.author = d.author.split('_').join(' ');
  //    d.author = d.author.split('[').join("");
  //    d.author = d.author.split(']').join("");
  //    if(d.author.indexOf('<') !== -1) {
  //      return toTitleCase(d.author.split('<')[0].trim());
  //    }
  //    return toTitleCase(d.author.trim());
  //  })
  //  .key(function(d) {
  //    return moment(d.date).format('DD-MM-YYYY');
  //  })
  //  .rollup(function(leaves) {
  //    return leaves.length;
  //  })
  //  .entries(commits.filter(function(d) {
  //    if(d.author.indexOf('unknown') !== -1) {
  //      return false;
  //    }
  //    if(d.author.indexOf('<') !== -1) {
  //      var email = d.author.split('<')[1].split('>')[0];
  //      if(email.indexOf('@mmtdigital.co.uk') === -1) {
  //        return false;
  //      }
  //      d.author = toTitleCase(d.author.split('<')[0]);
  //    }
  //    return true;
  //  })).sort(function(a, b) {
  //    return d3.ascending(a.key, b.key);
  //  });

  //var timeseries = ['x'];
  //for(var i = 30, l = 0; i > l; i--) {
  //  timeseries.push(moment().add(-i, 'days').format('DD-MM-YYYY'));
  //}

  //var types = {};
  var groups = [];
  var cols = ['Commits'];

  //var row;
  for(var i = 0, l = results.length; i < l; i++) {
    groups.push(results[i].key);
    //types[results[i].key] = 'area-spline';
    //groups.push(results[i].key);
    //
    //for(var j = 0, jl = 30; j < jl; j++) {
    //  row.push(0);
    //}
    //for(j = 0, jl = results[i].values.length; j < jl; j++) {
    //  row[timeseries.indexOf(results[i].values[j].key)] = results[i].values[j].values;
    //}
    cols.push(results[i].values);
  }

  console.log(cols);

  var chart = c3.generate({
    bindto: '.graph-content',
    data: {
      //x: 'key',
      //xFormat: '%d-%m-%Y',
      type: 'bar',
      columns: [cols],
      //groups: [groups]
    },
    point: {
      show: false
    },
    axis: {
      x: {
        type: 'category',
        categories: groups
      }
    },
    //axis: {
    //  x: {
    //    type: 'timeseries',
    //    tick: {
    //      format: '%e %B %Y'
    //    }
    //  }
    //},
    legend: {
      show: false
      //position: 'right'
    },
    //size: {
    //  height: 258
    //},
    //tooltip: {
    //  grouped: false
    //}
  });
});