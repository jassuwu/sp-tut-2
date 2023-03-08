- Routes
- Calendar

  - GET `/calendar` -> List of Calendars
  - GET `/calendar/:year` -> Get the Particular Calendar
  - POST /calendar
    - body : year (tbd), holidays
  - PUT `/calendar/:year`
    - body : holidays
  - DELETE `/calendar/:year`

- Planner
  - GET `/calendar/:year/planner` -> List of planners from :year calendar
  - GET `/calendar/:year/planner/:id` -> Get a Particular planner of the :year
  - POST `/calendar/:year/planner`
    - body: name, activities, start_date
  - PUT `/calendar/:year/planner/:id`
    - body: name, activities, start_date
  - DELETE `/calendar/:year/planner/:id`

---

- JSON Objects
- activites
  - `[ { name: string, type: "RELATIVE" | "ABSOLUTE", value: string } ]`
- holidays
  - `[ { name: string, date: string } ]`
