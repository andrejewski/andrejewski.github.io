(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

function getRepos(callback) {
  request('get', 'https://api.github.com/users/andrejewski/repos?per_page=100', callback);
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
