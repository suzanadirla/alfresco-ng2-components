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

import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { FormService } from './../services/form.service';
import { WidgetVisibilityService }  from './../services/widget-visibility.service';
import { ActivitiForm } from './activiti-form.component';
import { ContentLinkModel } from './widgets/core/content-link.model';
import { FormOutcomeModel } from './widgets/core/index';

/**
 * Displays the start form for a named process definition, which can be used to retrieve values to start a new process.
 *
 * After the form has been completed the form values are available from the attribute component.form.values and
 * component.form.isValid (boolean) can be used to check the if the form is valid or not. Both of these properties are
 * updated as the user types into the form.
 *
 * @Input
 * {processDefinitionId} string: The process definition ID
 * {showOutcomeButtons} boolean: Whether form outcome buttons should be shown, this is now always active to show form outcomes
 *  @Output
 *  {formLoaded} EventEmitter - This event is fired when the form is loaded, it pass all the value in the form.
 *  {formSaved} EventEmitter - This event is fired when the form is saved, it pass all the value in the form.
 *  {formCompleted} EventEmitter - This event is fired when the form is completed, it pass all the value in the form.
 *
 * @returns {ActivitiForm} .
 */
@Component({
    selector: 'activiti-start-form',
    templateUrl: './activiti-start-form.component.html',
    styleUrls: ['./activiti-form.component.css']
})
export class ActivitiStartForm extends ActivitiForm implements AfterViewChecked, OnChanges {

    @Input()
    public processDefinitionId: string;

    @Input()
    public processId: string;

    @Input()
    public showOutcomeButtons: boolean = true;

    @Input()
    public showRefreshButton: boolean = true;

    @Input()
    public readOnlyForm: boolean = false;

    @Output()
    public outcomeClick: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    @ViewChild('outcomesContainer', {})
    public outcomesContainer: ElementRef = null;

    constructor(private translate: AlfrescoTranslationService,
                formService: FormService,
                visibilityService: WidgetVisibilityService,
                logService: LogService) {
        super(formService, visibilityService, null, null, logService);

        if (this.translate) {
            this.translate.addTranslationFolder('ng2-activiti-form', 'assets/ng2-activiti-form');
        }

        this.showTitle = false;
    }

    public ngOnInit(): void {
        this.formService.formContentClicked.subscribe((content: ContentLinkModel) => {
            this.formContentClicked.emit(content);
        });
    }

    public ngOnChanges(changes: SimpleChanges): any {
        let processDefinitionId = changes.processDefinitionId;
        if (processDefinitionId && processDefinitionId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.getStartFormDefinition(processDefinitionId.currentValue);
            return;
        }

        let processId = changes.processId;
        if (processId && processId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.loadStartForm(processId.currentValue);
            return;
        }
    }

    public loadStartForm(processId: string): void {
        this.formService
            .getStartFormInstance(processId)
            .subscribe(
                (form) => {
                    this.formName = form.name;
                    form.processDefinitionId = this.processDefinitionId;
                    this.form = this.parseForm(form);
                    this.form.readOnly = this.readOnlyForm;
                    // this.form.processDefinitionId = this.processDefinitionId;
                    this.onFormLoaded(this.form);
                },
                (error) => this.handleError(error)
            );
    }

    public getStartFormDefinition(processId: string): void {
        this.formService
            .getStartFormDefinition(processId)
            .subscribe(
                (form) => {
                    this.formName = form.processDefinitionName;
                    this.form = this.parseForm(form);
                    this.form.readOnly = this.readOnlyForm;
                    this.onFormLoaded(this.form);
                },
                (error) => this.handleError(error)
            );
    }

    /** @override */
    public isOutcomeButtonVisible(outcome: FormOutcomeModel, isFormReadOnly: boolean): boolean {
        if (outcome && outcome.isSystem && ( outcome.name === FormOutcomeModel.SAVE_ACTION ||
            outcome.name === FormOutcomeModel.COMPLETE_ACTION )) {
            return false;
        } else if (outcome && outcome.name === FormOutcomeModel.START_PROCESS_ACTION) {
            return true;
        }
        return super.isOutcomeButtonVisible(outcome, isFormReadOnly);
    }

    /** @override */
    public saveTaskForm(): any {
        // do nothing
    }

    /** @override */
    public onRefreshClicked(): void {
        if (this.processDefinitionId) {
            this.visibilityService.cleanProcessVariable();
            this.getStartFormDefinition(this.processDefinitionId);
        } else if (this.processId) {
            this.visibilityService.cleanProcessVariable();
            this.loadStartForm(this.processId);
        }
    }

    public completeTaskForm(outcome?: string): void {
        this.outcomeClick.emit(outcome);
    }
}
