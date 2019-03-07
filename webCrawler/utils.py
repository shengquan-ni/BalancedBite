import json
dinner_file="D:\\dinner.json"
lunch_file="D:\\lunch.json"
breakfast_file="D:\\breakfast.json"
other_file="D:\\other.json"
dinner=json.load(open(dinner_file))
breakfast=json.load(open(breakfast_file))
lunch=json.load(open(lunch_file))
other=json.load(open(other_file))
file_list=[breakfast,dinner,lunch,other]

def countTag(files):
    tags=set()
    for i in files:
        for j in i:
            for k in j['tags']:
                tags.add(k)
            for k in j['index']:
                tags.add(k)
    return tags

def saveFiles():
    json.dump(dinner,open(dinner_file,'w'))
    json.dump(breakfast,open(breakfast_file,'w'))
    json.dump(lunch,open(lunch_file,'w'))
    json.dump(other,open(other_file,'w'))

def updateSource(files):
    count=0
    for i in files:
        for j in i:
            if j['source']==None:
                j['source']="EatingWell Kitchen"
                count+=1
    print("found {} dishes without source".format(count))