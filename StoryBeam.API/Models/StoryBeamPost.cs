using System.ComponentModel.DataAnnotations;

namespace StoryBeam.API.Models
{
    public class StoryBeamPosts
    {
        public int ID {get;set;}
        public string Title {get;set;} = String.Empty;
        public string Content {get;set;} = String.Empty;
        private string _author = String.Empty;
        public string Author
        {
            get
            {
                return _author?.ToUpper() ?? String.Empty;
            }
            set
            {
                _author = value ?? String.Empty;
            }
        }

        public DateTime CreatedAt {get;set;} = DateTime.UtcNow;
        public bool isPublished {get;set;} = false;

        public string Category {get;set;} = String.Empty;
    }
}





