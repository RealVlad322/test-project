export enum Directions {
  ASC = 'asc',
  DESC = 'desc',
}

export enum AmqpEvents {
  SYNC_ALL = 'sync.all',
  SYNC_ALL_STUDENTS = 'sync.allstudents',
  SAVE_MANY = 'save.many',
}

export enum AmqpQueues {
  DATA_QUEUE = 'data_queue',
  SAVE_QUEUE = 'save_queue',
}
