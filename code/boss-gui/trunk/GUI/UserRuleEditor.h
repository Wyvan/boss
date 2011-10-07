/*	General User Interface for BOSS (Better Oblivion Sorting Software)
	
	Providing a graphical frontend to BOSS's functions.

    Copyright (C) 2011 WrinklyNinja & the BOSS development team.
    http://creativecommons.org/licenses/by-nc-nd/3.0/

	$Revision: 2188 $, $Date: 2011-01-20 10:05:16 +0000 (Thu, 20 Jan 2011) $
*/

#ifndef __RULEEDITOR__HPP__
#define __RULEEDITOR__HPP__

#include "BOSS-Common.h"

#include "wx/wxprec.h"

#ifndef WX_PRECOMP
#	include "wx/wx.h"
#endif

#include <wx/rearrangectrl.h>
#include <wx/srchctrl.h>

using namespace boss;
using namespace std;

class UserRulesEditorFrame : public wxFrame {
public:
	UserRulesEditorFrame(const wxChar *title, wxFrame *parent);
	void OnOKQuit(wxCommandEvent& event);
	void OnCancelQuit(wxCommandEvent& event);
	void OnSearchModlist(wxCommandEvent& event);
	void OnSearchMasterlist(wxCommandEvent& event);
	void OnSelectModInMasterlist(wxCommandEvent& event);
	void OnSortingCheckToggle(wxCommandEvent& event);
	void OnMessageAddToggle(wxCommandEvent& event);
	void OnSortInsertChange(wxCommandEvent& event);
	void OnRuleCreate(wxCommandEvent& event);
	void OnRuleEdit(wxCommandEvent& event);
	void OnRuleDelete(wxCommandEvent& event);
	void OnToggleRuleCheckbox(wxCommandEvent& event);
	void OnRuleSelection(wxCommandEvent& event);
	void OnRuleOrderChange(wxCommandEvent& event);
	DECLARE_EVENT_TABLE()
private:
	vector<item> Modlist, Masterlist;
	vector<rule> Userlist;
	wxButton *NewRuleButton;
	wxButton *EditRuleButton;
	wxButton *DeleteRuleButton;
	wxRadioButton *SortModOption;
	wxRadioButton *InsertModOption;
	wxCheckBox *AddMessagesCheckBox;
	wxCheckBox *ReplaceMessagesCheckBox;
	wxListBox *InstalledModsList;
	wxListBox *MasterlistModsList;
	wxSearchCtrl *ModlistSearch;
	wxSearchCtrl *MasterlistSearch;
	wxTextCtrl *ModMessagesBox;
	wxChoice *BeforeAfterChoiceBox;
	wxChoice *TopBottomChoiceBox;
	wxTextCtrl *NewModMessagesBox;
	wxRearrangeList *RulesList;
	wxTextCtrl *RuleModBox;
	wxTextCtrl *SortModBox;
	wxCheckBox *SortModsCheckBox;
	wxTextCtrl *InsertModBox;
};

#endif