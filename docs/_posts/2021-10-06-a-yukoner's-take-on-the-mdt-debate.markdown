---
layout: post
title:  "A Yukoner's Take on the MDT Debate"
date:   2021-10-06 12:00:00 -0700
---

When I submitted my response to the Yukon’s [survey](https://globalnews.ca/news/6633447/yukon-permanent-daylight-saving-time/) on ending the time change, I had but one motive in mind. I’ll confess: I didn’t care about energy savings, children’s recess, or [SAD](https://en.wikipedia.org/wiki/Seasonal_affective_disorder). In fact, I didn’t even mind having to deal with the twice-annual shifting of the clocks (though I’d appreciate it if we dispensed with time zone acronyms and moved to UTC offsets).

No, all that mattered to me were the hours of sunlight outside of working hours (HSOW). I’m not making an argument that this is the best metric, or even a good one, so take this analysis as you see fit. But with Alberta pondering the move to permanent UTC-06 (MDT for the uninitiated), I thought I’d have a crack at seeing how this would play out in Edmonton and Calgary.

Before we get to the bulk of the calculations, let me explain what I mean by HSOW and how it’s affected by shifting time zones. Consider a 9–5 work day with 8 hours of sunlight and a theoretical solar noon at 12:00 (standard time). That means half of the daylight is before 12:00, and half after 12:00. As shown below, we get an hour of sunlight in the morning before work, and no sunlight in the evening. A switch to daylight saving time means that a 12:00 solar noon is now a 13:00 solar noon, and it coincides perfectly with the middle of our 8 hour work day. The sun shines while at work, but we get no sun in the morning or evening. We’ve lost 1 HSOW.

![A chart showing the shift in daylight hours from working hours when switching to daylight saving time]({{site.baseurl}}/assets/images/daylight_saving_solar_noon.png)

With solar noon at 12:00 standard time, a shift to daylight savings time means we lose an hour of sunlight outside of 9–5 working hours.
But solar noon is not always at noon. In fact, in the Yukon, where historically the time zone was UTC-09 but switched to UTC-08 in 1966 to synchronize us with BC, our solar noon was already shifted to hover around 13:00. So the shift to permanent UTC-07 gave us more sunlight in the evening than we previously enjoyed, while stripping none of the benefits of morning light (because we had none).

But what about Alberta? Let’s look at the same 8-hours-of-sun example with some real data from Edmonton for this upcoming winter. On November 29th, solar noon will be roughly at 12:20 UTC-07. Shifting to UTC-06 means losing 40 minutes of sun in the morning, and gaining 20 minutes in the evening. On balance, we lose 0.33 HSOW. But when the second such day rolls around in January, the solar noon will be at 12:40 UTC-07. Here, we gain 0.33 HSOW.

![A chart showing the shift in daylight hours from working hours when switching to daylight saving time for two real days in Edmonton]({{site.baseurl}}/assets/images/daylight_saving_solar_noon_edmonton.png)

The 2 ~8 hour days in Edmonton for Winter 2021/2022, and an estimate of the gain or loss in HSOW
If we repeat this same calculation for every day from the beginning of Standard Time on November 7th, to its last day on March 12th, and then average it out (ignoring weekday vs weekend), we get a decent estimate of average net daily change in HSOW.

Before we do however, let me introduce a couple changes to our model. First, instead of strictly considering hours of sunlight, let’s consider the civil twilight as well. This is essentially the period after sunset during which there’s enough visibility to do stuff outside, and is defined as the interval between the sunset and the sun dipping 6 degrees below the horizon. The second change is to not only consider a 9–5 workday, but an 8–4 one as well. This doesn’t encompass everyone, to be sure, but is a broader approach.

Below are four graphs showing the overlap between workdays and hours of light for every day in this upcoming Winter. The top red band shows HSOW only afforded to those on a 9–5 schedule. The bottom green band shows HSOW that only those working 8–4 will enjoy. The band in the middle is HSOW that no one gets, and anything outside the bands is HSOW for all.

![A chart showing the overlap between working hours and sunlight in Edmonton under MST.]({{site.baseurl}}/assets/images/hsow_edmonton_mst.png)

![A chart showing the overlap between working hours and sunlight in Edmonton under MDT.]({{site.baseurl}}/assets/images/hsow_edmonton_mdt.png)

![A chart showing the overlap between working hours and sunlight in Calgary under MST.]({{site.baseurl}}/assets/images/hsow_calgary_mst.png)

![A chart showing the overlap between working hours and sunlight in Calgary under MDT.]({{site.baseurl}}/assets/images/hsow_calgary_mdt.png)

Clearly, the switch to permanent UTC-06 (MDT) is better for the 8–4'ers. They’re not getting much light in the morning with MST, but stand to gain a full hour of light in the evening everyday for the entire Winter. For the 9–5'ers, the difference appears negligible, since the afternoon light gained is essentially offset by an equivalent loss of light in the morning. At that point, it’s just preference between morning and evening light.

Finally, here’s a table detailing the average HSOW for each city and work schedule, and the gain in average total daily HSOW for switching to permanent MDT (UTC-06):

![A table showing the hours of sunlight outside of work gained or lost in Edmonton and Calgary under permanent daylight saving.]({{site.baseurl}}/assets/images/permanent_mdt_hsow_gained_lost_table.png)

Data from [sunrise-sunset.org](https://sunrise-sunset.org/)