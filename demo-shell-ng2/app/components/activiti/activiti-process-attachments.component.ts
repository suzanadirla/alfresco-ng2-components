/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProcessAttachmentListComponent, ProcessUploadService } from 'ng2-activiti-processlist';
import { UploadService } from 'ng2-alfresco-core';

@Component({
    selector: 'activiti-process-attachments',
    templateUrl: './activiti-process-attachments.component.html',
    styleUrls: ['./activiti-process-attachments.component.css'],
    providers: [
        { provide: UploadService, useClass: ProcessUploadService }
    ]
})

export class ActivitiProcessAttachmentsComponent implements OnInit {

    @Input()
    processId: string;

    @ViewChild(ProcessAttachmentListComponent)
    processAttachList: ProcessAttachmentListComponent;

    fileShowed: boolean = false;
    content: Blob;
    contentName: string;

    constructor(private uploadService: UploadService) {

    }

    ngOnInit() {
        this.uploadService.fileUploadComplete.subscribe(value => this.onFileUploadComplete(value.data));
    }

    onFileUploadComplete(content: any) {
        this.processAttachList.add(content);
    }

    onAttachmentClick(content: any): void {
        this.fileShowed = true;
        this.content = content.contentBlob;
        this.contentName = content.name;
    }

}
