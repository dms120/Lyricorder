import { NgModule } from '@angular/core';
import { LyricEditor } from './lyric-editor';
import { IonicPageModule } from 'ionic-angular';
import { LyricsTabPageModule } from '../lyrics-tab/lyrics-tab.module';
import { IdeasPageModule } from '../ideas-page/ideas-page.module';
import { NotesTabPageModule} from '../notes-tab/notes-tab.module';

@NgModule({
    declarations: [
        LyricEditor
    ],
    imports: [
        IonicPageModule.forChild(LyricEditor),
        LyricsTabPageModule,
        IdeasPageModule,
        NotesTabPageModule
    ],
	exports: [
		LyricEditor
	]
})
export class LyricEditorModule { }