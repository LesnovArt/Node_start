import chalk from "chalk";
import { fetchTypicode } from "../api/fetchTypicode.mjs";
import { WithTime, EVENTS } from "../emitter/withTime.mjs";

const withTime = new WithTime();

withTime.once(EVENTS.start, (payload) => console.log(`Fetching starts at ${payload.startTime}`));
withTime.on(EVENTS.end, ({ executionTime, data: { id, userId, title, body } }) => {
  console.log(`Fetching is finished. Total duration is ${executionTime}ms.`);
  console.log(`UserId: ${userId}`);
  console.log(`ID: ${id}`);
  console.log(`Title: ${title}`);
  console.log(`Body: ${body}`);

  withTime.removeAllListener();
});
withTime.on(EVENTS.error, (payload) => {
  console.log(
    chalk.bgRedBright(
      `Fetching failed. Total duration is ${payload.executionTime}ms. Error occurs: ${payload.error}`
    )
  );
  withTime.removeAllListener();
});

withTime.execute(fetchTypicode);
