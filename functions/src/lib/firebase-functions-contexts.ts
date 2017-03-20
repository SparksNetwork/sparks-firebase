import * as functions from 'firebase-functions'
import {
  Request,
  Response,
} from 'firebase-functions'

export function httpContext(fn: Function): (req: Request, res: Response) => void {
  return (req: Request, res: Response): void => {
    console.log(fn.name, req.body)
    return fn(req.body)
      .then(result => res.status(200).send(result))
      .catch(err => {
        console.error(fn.name, req.body, err)
        res.status(500).send(err)
      })
  }
}

export function pubSubContext(fn: Function): (event: functions.Event<functions.pubsub.Message>) => Promise<any> {
  return (event: functions.Event<functions.pubsub.Message>): Promise<any> => {
    console.log(fn.name, event.data.json)
    return fn(event.data.json)
  }
}
