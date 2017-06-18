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

import { Component, ElementRef, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { GroupUserModel } from '../core/group-user.model';
import { GroupModel } from '../core/group.model';
import { WidgetComponent } from './../widget.component';

@Component({
    selector: 'people-widget',
    templateUrl: './people.widget.html',
    styleUrls: ['./people.widget.css']
})
export class PeopleWidget extends WidgetComponent implements OnInit {

    public popupVisible: boolean = false;
    public minTermLength: number = 1;
    public value: string;
    public users: GroupUserModel[] = [];
    public groupId: string;

    constructor(private formService: FormService,
                private elementRef: ElementRef) {
        super();
    }

    // TODO: investigate, called 2 times
    // https://github.com/angular/angular/issues/6782
    public ngOnInit(): void {
        if (this.field) {
            let user: GroupUserModel = this.field.value;
            if (user) {
                this.value = this.getDisplayName(user);
            }

            let params = this.field.params;
            if (params && params.restrictWithGroup) {
                let restrictWithGroup = <GroupModel> params.restrictWithGroup;
                this.groupId = restrictWithGroup.id;
            }

            // Load auto-completion for previously saved value
            if (this.value) {
                this.formService
                    .getWorkflowUsers(this.value, this.groupId)
                    .subscribe((result: GroupUserModel[]) => this.users = result || []);
            }
        }
    }

    public onKeyUp(): void {
        if (this.value && this.value.length >= this.minTermLength) {
            this.formService.getWorkflowUsers(this.value, this.groupId)
                .subscribe((result: GroupUserModel[]) => {
                    this.users = result || [];
                    this.popupVisible = this.users.length > 0;
                });
        } else {
            this.popupVisible = false;
        }
    }

    public onBlur(): void {
        setTimeout(() => {
            this.flushValue();
        }, 200);
    }

    public  flushValue(): void {
        this.popupVisible = false;

        let option = this.users.find((item) => {
            let fullName = this.getDisplayName(item).toLocaleLowerCase();
            return fullName === this.value.toLocaleLowerCase();
        });

        if (option) {
            this.field.value = option;
            this.value = this.getDisplayName(option);
        } else {
            this.field.value = null;
            this.value = null;
        }

        this.field.updateForm();
    }

    public getDisplayName(model: GroupUserModel): string {
        if (model) {
            let displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }

        return '';
    }

    // TODO: still causes onBlur execution
    public onItemClick(item: GroupUserModel, event: Event): void {
        if (item) {
            this.field.value = item;
            this.value = this.getDisplayName(item);
        }
        if (event) {
            event.preventDefault();
        }
    }

    public setupMaterialComponents(handler: any): boolean {
        super.setupMaterialComponents(handler);
        if (handler) {
            if (this.elementRef && this.value) {
                this.setupMaterialTextField(this.elementRef, handler, this.value);
                return true;
            }
        }
        return false;
    }
}
