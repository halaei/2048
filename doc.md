# Event Hierarchy

## Basic Events

### Roll
### Roll&Merge
### RandomInsertion

## View Events

### Step
A collection of many basic events

### StatusUpdate

## Control Events
Each has an StatusUpdate

### Move
has many Step event and may indicate game_over

### Reset/Init

### Undo
Has a collection of steps to be undone
