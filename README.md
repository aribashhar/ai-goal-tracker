# SmartFlow: AI powered Scheduler

#### Created by: @aribashhar, @fawaaz-kamali, @AzeemZsyed

SmartFlow is a web application designed to help users organize their daily schedule by combining fixed classes and user-defined goals. It provides visual timelines, calendar views, and AI-suggested scheduling to optimize daily productivity.

## Features

Add Classes: Set class names, days, and start/end times.

Add Daily Goals: Create goals with start time, duration (hours), and priority.

AI-Suggested Schedule: Automatically generates suggested task blocks while avoiding class overlaps.

Visual Timeline: See your tasks and classes in a timeline for quick overview.

Calendar View: Full weekly calendar that respects start times and durations.

Persistent Storage: Data is saved in localStorage, so your schedule persists across sessions.

## Installation

Clone the repository:

`git clone <your-repo-url>`

`cd ai-goal-tracker`

## Install dependencies:

`npm install`

## Start the frontend:

``npm run dev``

## (Optional) Run the backend for AI scheduling:

`cd backend`

`npm install`

`npm start`

## Usage

Add Classes: Enter the class name, select the day, and set start/end times.

Add Goals: Enter goal title, start time, duration, and priority.

Generate AI Schedule: Click “Suggest Schedule (AI)” to automatically place goals around your classes.

View Daily Tasks: Check the visual timeline on the right to see your day at a glance.

View Calendar: See all tasks and classes for the week in the calendar panel.

Remove Items: Use the remove buttons to delete classes or goals.

## Tech Stack

Frontend: React, FullCalendar, CSS

Backend (optional): Node.js/Express for AI schedule suggestions

Storage: LocalStorage

## Notes

Goals respect the start time and duration exactly.

AI scheduling avoids overlapping with classes.

Supports priorities (High, Medium, Low) which color-code tasks.
