class TrieNode {
    public:
        TrieNode* children[26];
        bool isLeaf;
        int count;
        
        TrieNode() {
            isLeaf=false;
            count=0;
            for (int i=0; i<26; i++) {
                this->children[i]=NULL;
            }
        }
}; 

class Solution
{
    public:
    void insert(TrieNode* root, string s) {
        TrieNode* p=root;
        for (int i=0; i<s.length(); i++) {
            int index=s[i]-'a';    
            if (p->children[index]) {
                p=p->children[index];
            }
            else {
                TrieNode* newNode=new TrieNode();    
                p->children[index]=newNode;
                p->count++;
                p=newNode;
            }
        }
        p->isLeaf=true;
    }
    
    vector<string> findPrefixes(string arr[], int n) {
        
        //code here
        TrieNode* root=new TrieNode();
        
        for (int i=0; i<n; i++) {
            insert(root, arr[i]);
        }
        vector<string> ans;
        
        for (int i=0; i<n; i++) {
            string str=arr[i];
            
            string prefix="";
            TrieNode* p=root;
            int loc=-1;
            
            for (int i=0; i<str.length(); i++) {
                int index = str[i]-'a';
                if (p->children[index]->count > 1) loc=i;
                p=p->children[index];
            }
            
            for (int i=0; i<loc+2; i++) prefix+=str[i];
            
            ans.push_back(prefix);
        }
        return ans;    
    }
    
};