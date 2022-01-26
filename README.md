# Analysis of Health Code Violations in Restaurants across NYC

NYU Tandon CS-GY 6313 Fall 2021 Information Visualization Final Project

Link to Observable Notebook : https://observablehq.com/d/ef7025c688f32269@4805

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/d/ef7025c688f32269@4805.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "ef7025c688f32269";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~

