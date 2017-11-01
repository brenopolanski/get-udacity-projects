/**
 * Udacity get projects by id
 *
 * run `node index.js [project_id] [start_project_id] [end_project_id] [time]`
 */

// node modules
const fs = require('fs');
// npm modules
const got = require('got');
const ora = require('ora');

// Newer versions of node.js use the lower-case argv
const argv = process.ARGV || process.argv;
const PROJECT_ID = Number(argv[2]);
const START_PROJECT_ID = Number(argv[3]);
const END_PROJECT_ID = Number(argv[4]);
const TIME = argv[5] || 5000; // 5 seconds

let aux = START_PROJECT_ID;
let projectsId = [];

function endpoint(task, id) {
  const base = 'https://review-api.udacity.com/api/v1';

  return {
    submissions: `${base}/submissions/${id}.json`
  }[task];
}

function api(options) {
  const { task, id } = options;
  const url = endpoint(task, id);

  got(url)
    .then(response => {
      const data = JSON.parse(response.body);

      if (data.project_id === PROJECT_ID) {
        projectsId.push(aux);
      }

      aux++;
    })
    .catch(error => {
      aux++;
      console.error(error.response.body);
    });
}

const spinner = ora('Getting projects').start();

const interval = setInterval(() => {
  if (START_PROJECT_ID === aux) {
    api({ task: 'submissions', id: aux });
    aux++;
  }
  else if (END_PROJECT_ID === aux || aux > END_PROJECT_ID) {
    spinner.stop();
    console.log(projectsId);
    clearInterval(interval);
  }
  else if (END_PROJECT_ID !== aux) {
    api({ task: 'submissions', id: aux });
  }
  else {
    spinner.stop();
    console.log(projectsId);
    clearInterval(interval);
  }
}, TIME);
