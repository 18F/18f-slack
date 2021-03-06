const moment = require("moment-timezone");
const sinon = require("sinon");
const { getNextHoliday } = require("./dates");

describe("gets the next holiday", () => {
  it("defaults to America/New_York time", async () => {
    // Midnight on May 28 in eastern timezone
    const clock = sinon.useFakeTimers(
      +moment.tz("2012-05-28", "YYYY-MM-DD", "America/New_York").format("x")
    );

    const nextHoliday = getNextHoliday();

    expect(moment(nextHoliday.date).isValid()).toBe(true);

    // remove this from the object match, otherwise
    // it becomes a whole big thing, dependent on
    // moment not changing its internal object structure
    delete nextHoliday.date;

    expect(nextHoliday).toEqual({
      name: "Independence Day",
      dateString: "2012-7-4",
    });

    clock.restore();
  });

  it("respects the configured timezone", async () => {
    // Midnight on May 28 in US eastern timezone.  Because our reminder
    // timezone is US central timezone, "now" is still May 27, so the
    // "next" holiday should be May 28 - Memorial Day
    const clock = sinon.useFakeTimers(
      +moment.tz("2012-05-28", "YYYY-MM-DD", "America/New_York").format("x")
    );

    const nextHoliday = getNextHoliday("America/Chicago");

    expect(moment(nextHoliday.date).isValid()).toBe(true);

    // remove this from the object match, otherwise
    // it becomes a whole big thing, dependent on
    // moment not changing its internal object structure
    delete nextHoliday.date;

    expect(nextHoliday).toEqual({
      name: "Memorial Day",
      dateString: "2012-5-28",
    });
    clock.restore();
  });
});
