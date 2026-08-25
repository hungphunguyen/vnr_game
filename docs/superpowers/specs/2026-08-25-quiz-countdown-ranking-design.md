# Quiz Countdown and Knowledge Ranking Design

## Goal

Add a visible 20-second countdown to each betting quiz and rank players by correct-answer count first, then by the smallest accumulated response time for correct answers.

## Quiz flow

When the player opens a quiz, the dialog displays a 20-second countdown. Selecting an answer stops the countdown immediately. A correct answer records the elapsed duration in milliseconds and increments the existing correct-answer total. A wrong answer or timeout is handled identically: the proposed bet is charged, no bet is recorded, and the quiz closes after the existing feedback delay.

## Ranking

Each player stores `correctAnswerTimeMs`, starting at zero. The knowledge ranking sorts by `correctAnswers` descending, then `correctAnswerTimeMs` ascending, then player id. The final knowledge panel displays each player's number of correct answers and their total correct-answer time in seconds.

## UI and lifecycle

The question dialog includes a semantic timer element. The UI countdown uses an interval for display, while time recording uses a monotonic timestamp (`performance.now`) when available. Opening, answering, timing out, starting another round, and closing feedback clear any outstanding timer so no stale callback can affect a later question.

## Tests

Unit tests verify that correct answers accumulate response time, wrong answers do not, and players with equal correct totals are ordered by the smallest accumulated correct-answer time. Markup and CSS tests verify the 20-second timer element and warning state styling.
