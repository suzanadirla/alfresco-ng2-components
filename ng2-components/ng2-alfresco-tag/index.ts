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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { MdButtonModule, MdInputModule } from '@angular/material';
import { CoreModule } from 'ng2-alfresco-core';

import { TagActionsComponent } from './src/components/tag-actions.component';
import { TagListComponent } from './src/components/tag-list.component';
import { TagNodeListComponent } from './src/components/tag-node-list.component';
import { TagService } from './src/services/tag.service';

export { TagActionsComponent } from './src/components/tag-actions.component';
export { TagListComponent } from './src/components/tag-list.component';
export { TagNodeListComponent } from './src/components/tag-node-list.component';
export { TagService } from './src/services/tag.service';
import { TagListComponent as TagList } from './src/components/tag-list.component';
export { TagNodeListComponent as TagNodeList } from './src/components/tag-node-list.component';
export { TagListComponent as TagList } from './src/components/tag-list.component';

export const TAG_DIRECTIVES: any[] = [
    TagActionsComponent,
    TagListComponent,

    // Old Deprecated export
    TagList,
    TagNodeListComponent
];

export const TAG_PROVIDERS: any[] = [
    TagService
];

@NgModule({
    imports: [
        CoreModule,
        MdInputModule,
        MdButtonModule
    ],
    declarations: [
        ...TAG_DIRECTIVES
    ],
    providers: [
        ...TAG_PROVIDERS
    ],
    exports: [
        ...TAG_DIRECTIVES,
        MdInputModule,
        MdButtonModule
    ]
})
export class TagModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TagModule,
            providers: [
                ...TAG_DIRECTIVES
            ]
        };
    }
}
