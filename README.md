## Setup

To setup your local instance, add your WMATA developer account API key to `backend/.env.local` as `WMATA_API_KEY` (e.g. `WMATA_API_KEY="XXXXXXXXXXXXXX"`). Then, run `./setup.sh`. This command will build the local docker images, install php and npm dependencies, and start the containers.

After that, you should be able to navigate to localhost:5173 and see the app. Changes you make will appear live. The API will be available at localhost:8000.

## Expected Usage

Users will configure this app with their WMATA developer account credentials, get it set up, select a WMATA station, and view current data about expected arrival times of inbound trains to that station. Because they station code is a route parameter, they're free to bookmark frequently viewed stations as well.

The app automatically queries for new train arrival data every 5 seconds, and only ever queries for the station the user is currently viewing. That amounts to a maxmimum 17280 calls per day, plus a new query for station every page refresh. Free-tier accounts are allowed 50000 queries/day and 10 API calls/second, so that is plenty for now. However, the addition of new features -- or multiple users using the same instance -- could necessitate a slowing of that rate, as well as more extensive caching and rate limiting.

## System Overview

### Backend

- The backend is an API written in Symfony.

- WMATA configuration:
    - Wmata URL and API key are stored in `.env` and `.env.local`, respectively, and provided to the `RailService` via its configuration in `services.yml`. To run the app, you'll need to sign up for a free WMATA developer account and store your own api key in the .env file.

- Controllers:
    - Currently there is one controller (aside from the boilerplate `HelloWorldController`), called the `RailController`. It exists at the route `/` and handles all rail interactions. 
    - A more extensible construction would involve separating that out into a `TrainStationController` at the route `api/v1/train-stations` and another called the `TrainController` at the route `api/v1/train-station/:code`. TrainStationController would provide endpoints about train stations in general, and `TrainController` would provide endpoints scoped to a given train station code. It sends 429 to the frontend when it receives 429 errors from the WMATA APIs, and provides a more generic 502 Bad Gateway error for all other errors related to querying WMATA for data.

- Services:
    - Currently there is one service called the `RailService`, which is injected into the `RailController`. It should be renamed the `WmataService`, since its implementation is specific to the WMATA API. It should, however, continue to implement the more generic `RailServiceInterface`.

- Data Types:
    - StationDtos:
        - StationDto: `code` (string), `name` (string)
        - StationArrayDto: `stations` (StationDto[])

    - TrainDtos:
        - TrainDto: `destinationName` (string), `line` (string), `min` (?string), `car` (?string)
        - TrainArrayDto: `trains` (TrainDto[])

### Frontend

- The frontend is a single page application written in React. 

- Tanstack Query, formerly React Query, handles querying the backend for data, caching that data, and making it accessible across components. It also makes it easier to handle loading and error states.
    - Tanstack makes it easy to share data between components. The queries are written into custom hooks, and attempt to pull their data from the cache when they're called before reaching out to the backend, unless configured otherwise.

- React Router handles frontend routing. 
    - Currently when a user hits the route `/`, they're met with a station picker, and upon selecting a station they're taken to the route `/station/:code`, where a table shows them arrival time data for that station. The station picker persists on those child routes.
    - A more extensible architecture would involve moving arrival time data to `/station/:code/arrival-times`; that way, if later on we supported querying for other station information like accessibility accessibility features, we could put that at `/station/:code/accessibility`.

- Currently, the frontend redirects to an Error page when any query receives an error response. Down the line, certain errors will warrant less aggressive error states.

## Future Improvements

- Backend caching. 
    - While frontend caching helps keep trips to the backend down, it only caches a user's data for that user, on that device. Backend caching, on the other hand, would allow data from a single query to WMATA to be shared between many users, and even potentially allow for meaningful short-term caching for queries whose data stales quickly. We could use CachingHttpClient with Redis or alternative to prevent more queries than necessary.

- Authorization 
    - Authorization would mainly be valuable in the case that this app is later hosted, so a single instance serves multiple users.
    - Combined with a database, would allow for account specific app configurations. For example:
        - Storing favorite stops per user account. A button at the top of the app could takes me right to Columbia Heights without having to search. 
        - A first draft of that could be quickly implemented without authorization as well, by leveraging local storage.

- More fault tolerant error states:
    - Right now, any query error redirects to an error page. 
        - On the frontend, components should have less aggressive error states. In other words, a component itself should "error out", but the rest of the page should remain functional.
        - On the backend, certain types of errors should trigger automatic retries.

- Improvements to styling, keeping in mind accessibility.
    - Better scrolling
    - Sorting options for train arrival data
    - Breakpoints for mobile devices.

- Better handling of WMATA API quirks:
    - When delivering arrival data about the last train of the day, the WMATA API returns the value "LastTrain" for the field `DestinationStation`, which in the current UI masks which direction that train is heading.

- A method to have types "bubble up" from the backend to the frontend
    - Could possibly use some kind of swagger doc converter, which would transform the DTOs as well as error messages into Typescript types, and provide them to the frontend.

- Replace try/catch blocks in controller endpoints with a custom exception listener. On the other hand, though, that's less explicit.

## Testing Outline

### Backend

[Symfony offers extensive testing support.](https://symfony.com/doc/current/testing.html)

- Unit tests should support the functions in the `RailService`. They should test:
    - The deserializing logic of the JSON into the DTOs, using different JSON blobs: some with more keys, some missing keys, some invalid, etc.
    - The validation logic stored in those DTOs, after those different JSON blobs have been passed in.

- Integration tests should support how services interact: They should test:
    - The hitting of the WMATA API by the functions in the `RailService`.
    - Instances of dependency injection in the app, including:
        - The `RailService` pulling in the the http client, the serializer, and the validator.
        - The `RailController` pulling in the `RailService` and the logger.

- Application tests should support the overall functioning of the the app at large. They should test: 
    - The app's ability to handle HTTP traffic and respond to it correctly, by way of sending mock HTTP requests to the endpoints of the `RailController` and making assertions about the results.

### Frontend

- Vitest is a great package for React testing.

- Unit tests should test how components react given various parameters. For example:
    - how does the error page handle a new custom error message being returned from the backend?
    - How does the error page handle an error returned in a slightly different format?
