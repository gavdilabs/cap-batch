# @gavdi/cap-batch - Batch Query Utils for CAP NodeJS

A simple, yet effective way of batching requests from CAP to an OData API near you!

## What's In The Box?

`@gavdi/cap-batch` comes with a full query builder for when you want to send a large quantity of requests towards OData V2/4 APIs.

The package requires CAP version 7 or higher, and uses the built-in service structure from CAP to perform the HTTP queries towards your desired target.

### Main Features

- Easy batch request instantiation by supplying a CDS remote service instance to the constructor and then adding requests using Builder methodology.
- Set the size of batch size. ie. SuccessFactors allows for max 180 calls in a batch at a time. Setting the page size to fx 50 in the constructor will make the tool recursively separate 100 request fx into 2 pages/$batch call and 110 into 3 etc.
- Support for any valid target path. ie. also /upsert

## Installation

To install the package, you run the following command in your service layer root:

```shell
npm i --save @gavdi/cap-batch
```

Once installed, in your project you can then make use of it in your project.

Should you want to use it with our recommended template for CAP, you can then make use of it through Dependency Injection, using the following setup:

```typescript
// service.ts - boostrapping
...

import { BatchQueryBuilderFactory, DataServiceVersion } from "@gavdi/cap-batch";

...

export default async (srv: Service) => {
    ... // Default bootstrapping logic

    await InitDIContainer([
        {
            id: "sf.batchfactory",
            value: new BatchQueryBuilderFactory(
                SuccessFactorsService,
                DataServiceVersion.ODataV2
            )
        }
    ]);

    useContainer(Container);

    ... // Default bootstrapping logic
}

// CustomLogic.ts - Your implementation
...
import { BatchQueryBuilderFactory } from "@gavdi/cap-batch";

class CustomLogic {

    @Inject("sf.batchfactory")
    public batchFactory: BatchQueryBuilderFactory

    @OnRead()
    public async YourOnReadMethod(@Req() req: Request): Promise<unknown> {
        const batcher = batchFactory.createInstance(req);

        // Your logic here
    }
}
```

The advantage of using this setup is that you do not have to re-establish the service connection or store unnecessary variables locally for you to setup a batch builder.

## Usage

The batch query builder is simple to use, and always returns what ever you input in the same order upon returning the result.

Included in this package is also the types necessary for making sure that your data is returned exactly the way that you expect.

> **NOTE: Currently it is NOT supported to have GET then POST then GET requests, please for now, add GET Requests first then the others - otherwise you cannot depend on the order responses come back out**

Simple usage example:

```typescript
// Create/get your builder
const builder = new BatchQueryBuilder(req, service, 50, DataServiceVersion.ODataV2);

// Construct some requests
builder
    // GET request
    .addRequest({
        path: "/User",
        method: BatchMethod.GET,
        contentType: BatchContentType.HTTP,
    })
    // PATCH request
    .addRequest({
        path: "/Position(id='1234')",
        method: BatchMethod.PATCH,
        contentType: BatchContentType.JSON,
        data: {...}
    })
    // DELETE request
    .addRequest({
        path: "/Information(id='1234')",
        method: BatchMethod.DELETE,
        contentType: BatchContentType.HTTP,
    })
    // POST request
    .addRequest({
        path: "/Random",
        method: BatchMethod.POST,
        contentType: BatchContentType.HTTP,
    });

// Fire off the requests
const responses = await builder.fire<unknown>();
if (!responses) {
    throw new Error("Something went wrong!");
}

// Parse/process your responses
const users = responses[0] as BatchResponse<User>;
const positions = responses[1] as BatchResponse<Position>;
const information = responses[2] as BatchResponse<Information>;
const random = responses[3] as BatchResponse<Random>;
```

For even simpler cases where you just want to edit or get multiple at the same time of the same type,
you can simply use the `builder.fire<Type>()` type casting.

## Resources

Want to learn more about batch processing? Look here:

- [OData V2 Batch Processing](https://www.odata.org/documentation/odata-version-2-0/batch-processing/)
- [OData V4 Batch Processing](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part1-protocol/odata-v4.0-errata02-os-part1-protocol-complete.html#_Toc406398359)

## TODO

- [ ] Allow for asynchronous batch requests. See [docs](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part1-protocol/odata-v4.0-errata02-os-part1-protocol-complete.html#_Toc406398359)
- [ ] Allow for adding url parameters to the $batch url. SF Allows for certain control params to be supplied ie.
- [ ] Allow mixing the order of GETS and Changeset requests by fixing the order of responses to match it.

---

(c) Copyright by Gavdi Labs 2024 - All Rights Reserved
