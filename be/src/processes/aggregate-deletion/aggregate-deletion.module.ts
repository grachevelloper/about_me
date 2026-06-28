import {Module} from "@nestjs/common";
import {AttachmentModule} from "src/modules/attachments/attachments.module";

import {AggregateDeletionService} from "./aggregate-deletion.service";

@Module({
    imports: [AttachmentModule],
    providers: [AggregateDeletionService],
    exports: [AggregateDeletionService],
})
export class AggregateDeletionModule {}
