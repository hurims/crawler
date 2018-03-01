// 'use strict';

// const puppeteer = require('puppeteer');
// var assert = require('assert');

class Program {
  constructor(time, title) {
    this.time = time;
    this.title = title;
  }
  toString() {
    return this.time + ":" + this.title;  
  }
}

function descPrograms(programs) {
  console.log(Array.from(programs).map((prog)=>prog.toString()).join('\n'));
}

function getUrl(year, month, date) {
  var new_month = month < 10 ? '0' + month : month;  
  var new_date = date < 10 ? '0' + date : date;  
  return 'http://guide.imbc.com/tv/index.aspx?date=' + year + new_month + new_date;
}

function getSelector() {
  return '#schedule_section > div.schedule_inner > div.schedule_timeLine_tv > div.timeLine_info > table.tableTv.scheduleMorning > tbody > tr:nth-child(2) > td.time';
}

function getTimes() {
  return Array.from(document.querySelectorAll("td.time")).map((elem) => elem.textContent);
}

function getTitles() {
  return Array.from(document.querySelectorAll("td.program_info a")).map((elem) => elem.textContent);
}
// (async() => {

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(getUrl(2018, 1, 3), {waitUntil: 'networkidle2'});

// Wait for the results to show up
await page.waitForSelector(getSelector());

// Extract the results from the page
const times = await page.evaluate(getTimes);
const titles = await page.evaluate(getTitles);
// assert(times.length == titles.length);

let programs = [];
for (let i = 0; i < times.length; ++i) {
  programs[i] = new Program(times[i], titles[i]);
}
descPrograms(programs);
await browser.close();
// })();
