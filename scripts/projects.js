(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function request(method, url, callback) {
  var XMLHttpRequest = window.XMLHttpRequest;
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status > 400) {
        return callback(new Error('Github failed to load repos'));
      }
      if (xmlhttp.status === 200) {
        var text = xmlhttp.responseText;
        var json;
        try {
          json = JSON.parse(text);
        } catch (error) {
          return callback(new Error('Malformed JSON'));
        }
        callback(null, json);
      }
    }
  };

  xmlhttp.open(method.toUpperCase(), url, true);
  xmlhttp.send();
}

var pageSize = 100;

function getRepos(callback, pageNumber) {
  pageNumber = pageNumber || 1;
  request('get', 'https://api.github.com/users/andrejewski/repos?page=' + pageNumber + '&per_page=' + pageSize, function (error, repos) {
    if (error) {
      return callback(error);
    }

    if (repos.length < pageSize) {
      return callback(null, repos);
    }

    getRepos(function (error, moreRepos) {
      if (error) {
        return callback(error);
      }

      callback(null, repos.concat(moreRepos));
    }, pageNumber + 1);
  });
}

function n(tagAndClass) {
  var parts = tagAndClass.split('.');
  var element = document.createElement(parts[0] || 'div');
  element.className = parts[1];
  return element;
}

function createProjectNode(options) {
  var project = n('.project');
  var about = n('.about');
  var links = n('.links');

  project.appendChild(about);
  project.appendChild(links);

  var title = n('h3');
  title.innerText = options.title;

  var description = n('p');
  description.innerText = options.description;

  about.appendChild(title);
  about.appendChild(description);

  var source = n('a.repo-link');
  source.innerText = 'View source';
  source.href = options.url;

  var homepage;
  if (options.homepage) {
    homepage = n('a.demo-link');
    homepage.innerText = 'Check it out';
    homepage.href = options.homepage;
  }

  if (homepage) {
    links.appendChild(homepage);
  }
  links.appendChild(source);

  return project;
}

var loadingSlot = document.getElementById('oss-loading-slot');
var slotList = document.getElementById('oss-slot-list');
var listToggle = document.getElementById('oss-list-toggle');

var showMoreText = 'Show all open source projects';
var showLessText = 'Chris, you really need to go outside';

function toggleList(showing) {
  var buttonText = showing ? showLessText : showMoreText;
  var listClass = 'projects ' + (showing ? 'projects--showing' : 'projects--hiding');
  listToggle.innerText = buttonText;
  slotList.className = listClass;
}

function main() {
  getRepos(function (error, repos) {
    if (error) {
      var errorMessage = createProjectNode({
        title: 'Github failed me',
        description: error.message,
        url: 'https://github.com/andrejewski'
      });
      slotList.replaceChild(errorMessage, loadingSlot);
      throw error;
    }

    repos = repos.sort(function (a, b) {
      var av = a.stargazers_count + a.forks_count;
      var bv = b.stargazers_count + a.forks_count;
      return bv - av;
    });

    slotList.innerHTML = '';
    for (var i = 0; i < repos.length; i++) {
      var repo = repos[i];
      var desc = repo.description;
      var isDescribed = desc && desc.length > 5;
      var isSource = !repo.fork;
      var worthShowing = isDescribed && isSource;
      if (!worthShowing) {
        continue;
      }
      var project = createProjectNode({
        url: repo.html_url,
        title: repo.name,
        description: repo.description,
        homepage: repo.homepage
      });
      slotList.appendChild(project);
    }
  });

  listToggle.onclick = function (flag) {
    return function () {
      flag = !flag;
      toggleList(flag);
    };
  }();
}

var shouldRun = loadingSlot && slotList && listToggle;
if (shouldRun) {
  main();
}

},{}]},{},[1]);

//# sourceMappingURL=projects.js.map
