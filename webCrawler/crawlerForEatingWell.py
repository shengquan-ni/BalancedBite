import requests
from bs4 import BeautifulSoup
import json
import re
import time

base_url="http://www.eatingwell.com/recipes/?page="
vaild_url_pattern=re.compile("http:\/\/www\.eatingwell\.com\/recipe\/\d+\/([\w-]+)\/")
dinner_file="D:\\dinner.json"
lunch_file="D:\\lunch.json"
breakfast_file="D:\\breakfast.json"
other_file="D:\\other.json"
cache_filename="D:\\cache.tmp"
max_try=5
img_src_full_star="https://images.media-allrecipes.com/EatingWellAssets/assets/svg/icon/recipe-rating-stars/eating-well-star-full.svg"

def getDataFromPage(page,dinner,lunch,breakfast,other):
    p=requests.get(page)
    if p.status_code==404:
        return "empty"
    if p.status_code>400:
        return "wait"
    if p.status_code!=200:
        return "error"
    soup=BeautifulSoup(p.text,"lxml")
    temp=[i.text.strip() for i in soup.find_all("span",{"class":"toggle-similar__title"})];
    try:
        index=temp[2:]
    except:
        print("index is ",temp,"url = ",page)
        index=temp
    temp=soup.find("h3",{"class":"recipeDetailHeader showOnTabletToDesktop"})
    try:
        title=temp.text.strip()
    except:
        print("title not found! url =",page)
        return "error"
    temp=soup.find("span",{"class":"submitterDisplayNameIntro"})
    try:
        source=temp.next_sibling.text.strip()
    except:
        print("source not found! url =",page)
        source=None
    temp=soup.find('div',{"class":"recipeSubmitter"})
    try:
        summary=temp.find("p").text.strip()
    except:
        print("summary not found! url = ",page)
        summary=None
    temp=soup.find("span",{"class":"submitterTitle"})
    try:
        author=temp.text.strip()
    except:
        print("no author! url = ",page)
        author=None
    tags=[i.text.strip() for i in soup.find_all("span",{"class":"nutritionTag"})]
    ingredients=[i.text.strip() for i in soup.find_all("span",{"itemprop":"ingredients"})]
    try:
        temp=soup.find("span",{"class":"servingsCount"}).text.strip()
        servings=temp.split()[0]
    except:
        print("servings not found! url = ",page)
        servings=None
    try:
        prep_time=soup.find("time",{"itemprop":"prepTime"}).text
    except:
        print("prep time not found! url = ",page)
        prep_time=None
    try:
        total_time=soup.find("time",{"itemprop":"totalTime"}).text
    except:
        print("total time not found! url = ",page)
        total_time=None
    instructions=[i.text.strip() for i in soup.find_all("span",{"class":"recipeDirectionsListItem","ng-bind-html":None})]
    try:
        tips=soup.find("div",{"class":"recipeFootnotes"}).text.strip()
    except:
        print("tips not found! url = ",page)
        tips=None
    temp=soup.find("span",{"itemprop":"calories"})
    try:
        cals=float(temp.text.strip().split()[0])
    except:
        print("cals not found! url = ",page)
        cals=None
    related = [i.text.strip() for i in soup.find_all("span",{"class":"recipeRelatedContentItemTitle"})]
    temp=[i for i in soup.find_all("div",{"class":"recipeReviewEntry"})]
    comments=[]
    avg_rating=0
    for i in temp:
        try:
            d={}
            d["rating"]=len(i.find_all("img",{"src":img_src_full_star}))
            avg_rating+=d["rating"]
            d["author"]=i.find("span",{"class":"noLink"}).text.strip()
            d["date"]=i.find("div",{"class":"recipeReviewEntryRatingDate"}).text.strip()
            d["comment"]=i.find("div",{"class":"recipeReviewEntryContentText"}).text.strip()
            comments.append(d)
        except:
            pass
    if comments!=[]:
        avg_rating/=len(comments)
    json_obj={"index":index,"title":title,"avg_rating":avg_rating,"comments":comments,\
             "related":related,"tips":tips,"cals":cals,"total_time":total_time,"prep_time":prep_time,\
             "servings":servings,"ingredients":ingredients,"tags":tags,"summary":summary,"author":author,"source":source,"instructions":instructions}
    small_index="".join(i.lower() for i in index)
    if "dinner" in small_index:
        dinner.append(json_obj)
    elif "lunch" in small_index:
        lunch.append(json_obj)
    elif "breakfast" in small_index:
        breakfast.append(json_obj)
    else:
        other.append(json_obj)
    return "success"


def expendFrontier(menu_page,frontier,visited):
    p=requests.get(menu_page)
    soup=BeautifulSoup(p.text,"lxml")
    res=0
    for i in soup.find_all(href=vaild_url_pattern):
        if not hash(i['href']) in visited:
            frontier.add(i['href'])
            res+=1
    return res

def runCrawler():
    frontier=set()
    visited=set()
    counter=1
    expendFrontier(base_url+str(counter),frontier,visited)
    breakfast,lunch,dinner,other=[],[],[],[]
    while len(frontier):
        for i in frontier:
            for j in range(max_try):
                res=getDataFromPage(i,dinner,lunch,breakfast,other)
                time.sleep(1)
                if res=="success" or res=="error":
                    break
            visited.add(hash(i))
        frontier=set()
        print("processed page",counter)
        counter+=1
        expendFrontier(base_url+str(counter),frontier,visited)
    return breakfast,lunch,dinner,other


            
if __name__=="__main__":
    breakfast,lunch,dinner,other=runCrawler()
    json.dump(dinner,open(dinner_file,'w'))
    json.dump(breakfast,open(breakfast_file,'w'))
    json.dump(lunch,open(lunch_file,'w'))
    json.dump(other,open(other_file,'w'))



