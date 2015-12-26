var DAYS = 7;

function accentsTidy(s) {
  var r = s.toLowerCase();
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
  return r;
}

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

  var units = 'days';
  var threeMonths = commits.filter(function(d) {
    if(units) {
      var startDate = moment().add(-DAYS, units).startOf(units);
      var endDate = moment().startOf(units);
      var commitDate = new Date(d.date);
      return !!(commitDate > startDate && commitDate < endDate);
    } else {
      return true;
    }
  });
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
      return rtn;
    })
    .rollup(function(leaves) {
      return leaves.length;
    })
    .entries(threeMonths)
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

  var groups = [];
  var cols = ['Commits'];

  for(var i = 0, l = results.length; i < l; i++) {
    groups.push(results[i].key);
    cols.push(results[i].values);
  }

  var maxValue = d3.max(results, function(d) {
    return parseInt(d.values, 10);
  });

  var chart = c3.generate({
    bindto: '.graph-content',
    data: {
      type: 'bar',
      columns: [cols],
      colors: {
        Commits: '#EF5350'
      }
    },
    axis: {
      x: {
        type: 'category',
        categories: groups
      }
    },
    legend: {
      show: false
    },
    padding: {
      top: 40,
      right: 56,
      bottom: 40,
      left: 80
    },
    grid: {
      focus: {
        show: false
      }
    },
    tooltip: {
      position: function(data, width, height, element) {
        var maxHeight = parseInt(d3.select(element).attr('height'), 10);
        return {
          top: maxHeight - 18 - ((data[0].value / maxValue) * maxHeight) * .9,
          left: parseInt(d3.select(element).attr('x'), 10) + (parseInt(d3.select(element).attr('width'), 10))
        }
      }
    }
  });

  function updateWindow() {
    chart.resize({
      height: parseInt(d3.select('.page-content').style('height'), 10)
    });
  }

  updateWindow();

  window.onresize = updateWindow;
});
